import mongoose from "mongoose";

const wardMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ward name is required"],
      trim: true,
      uppercase: true,
      minlength: [3, "Ward name must be at least 3 characters"],
    },

    code: {
      type: String,
      required: [true, "Ward code is required"],
      trim: true,
      uppercase: true,
      unique: true,
      match: [/^[A-Z0-9-]+$/, "Invalid ward code format"],
    },

    wardType: {
      type: String,
      required: [true, "Ward type is required"],
      enum: {
        values: [
          "GENERAL",
          "SEMI_PRIVATE",
          "PRIVATE",
          "DELUXE",
          "SUITE",
          "ICU",
          "NICU",
          "PICU",
          "CCU",
          "HDU",
          "ISOLATION",
          "BURN",
          "DAY_CARE",
        ],
        message: "Invalid ward type",
      },
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    floor: {
      type: String,
      trim: true,
    },

    totalBeds: {
      type: Number,
      required: [true, "Total beds is required"],
      min: [1, "Ward must have at least 1 bed"],
    },

    occupiedBeds: {
      type: Number,
      default: 0,
      min: [0, "Occupied beds cannot be negative"],
    },

    genderRestriction: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "MIXED"],
        message: "Gender restriction must be MALE, FEMALE, or MIXED",
      },
      default: "MIXED",
    },

    nursingLevel: {
      type: String,
      enum: {
        values: ["STANDARD", "HIGH_DEPENDENCY", "CRITICAL"],
        message: "Invalid nursing level",
      },
      default: "STANDARD",
    },

    isolationSupported: {
      type: Boolean,
      default: false,
    },

    oxygenSupported: {
      type: Boolean,
      default: false,
    },

    ventilatorSupported: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ================= INDEXES ================= */

wardMasterSchema.index({ code: 1 }, { unique: true });
wardMasterSchema.index({ wardType: 1, isActive: 1 });

/* ================= BUSINESS VALIDATION ================= */

// Bed count consistency
wardMasterSchema.pre("save", function (next) {
  if (this.occupiedBeds > this.totalBeds) {
    return next(
      new Error("Occupied beds cannot exceed total beds")
    );
  }

  // ICU / NICU must support oxygen
  if (
    ["ICU", "NICU", "PICU", "CCU"].includes(this.wardType) &&
    !this.oxygenSupported
  ) {
    return next(
      new Error(`${this.wardType} must have oxygen support`)
    );
  }

  // Ventilator only allowed in critical wards
  if (
    this.ventilatorSupported &&
    !["ICU", "NICU", "PICU", "CCU", "HDU"].includes(this.wardType)
  ) {
    return next(
      new Error("Ventilator support allowed only in critical wards")
    );
  }

  next();
});

/* ================= DUPLICATE KEY HANDLING ================= */

wardMasterSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Ward code already exists"));
  } else {
    next(error);
  }
});

export default mongoose.model("WardMaster", wardMasterSchema);

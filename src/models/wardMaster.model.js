import mongoose from "mongoose";

const wardMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ward name is required"],
      trim: true,
      uppercase: true,
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
      required: true,
      enum: [
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
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FloorMaster",
      required: true,
      index: true,
    },

    totalBeds: {
      type: Number,
      required: true,
      min: [1, "Total beds must be at least 1"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ================= INDEXES ================= */

wardMasterSchema.index({ wardType: 1, isActive: 1 });

/* ================= VIRTUAL RELATION ================= */

/**
 * This allows:
 * WardMaster.find().populate("beds")
 */
wardMasterSchema.virtual("beds", {
  ref: "BedMaster",
  localField: "_id",
  foreignField: "ward",
});

/* ================= BUSINESS VALIDATION ================= */

// Ensure totalBeds matches actual BedMaster count
wardMasterSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const BedMaster = mongoose.model("BedMaster");
  const bedCount = await BedMaster.countDocuments({
    ward: this._id,
    isActive: true,
  });

  if (bedCount > 0 && bedCount !== this.totalBeds) {
    return next(
      new Error(
        `Total beds (${this.totalBeds}) does not match BedMaster count (${bedCount})`
      )
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

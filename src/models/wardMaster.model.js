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

function formatDate(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

wardMasterSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.createdAt) {
      ret.createdAt = formatDate(ret.createdAt);
    }
    if (ret.updatedAt) {
      ret.updatedAt = formatDate(ret.updatedAt);
    }
    return ret;
  },
});

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

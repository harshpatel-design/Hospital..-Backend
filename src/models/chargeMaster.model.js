import mongoose from "mongoose";

const chargeMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    chargeType: {
      type: String,
      enum: [
        "OPD",
        "IPD",
        "EMERGENCY",
        "APPOINTMENT",
        "LAB",
        "PROCEDURE",
        "SERVICE",
      ],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    /* ================= GST FIELDS ================= */

    gstApplicable: {
      type: Boolean,
      default: false,
    },

    gstRate: {
      type: Number,
      enum: [0, 5, 12, 18],
      default: 0,
    },

    gstType: {
      type: String,
      enum: ["CGST_SGST", "IGST"],
      default: "CGST_SGST",
    },

    hsnCode: {
      type: String,
      trim: true,
    },

    taxInclusive: {
      type: Boolean,
      default: false,
    },

    /* =============================================== */

    labTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTest",
      default: null,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    effectiveFrom: {
      type: Date,
      default: Date.now,
    },

    effectiveTo: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

chargeMasterSchema.index({ code: 1, doctor: 1 }, { unique: true });

export default mongoose.model("ChargeMaster", chargeMasterSchema);

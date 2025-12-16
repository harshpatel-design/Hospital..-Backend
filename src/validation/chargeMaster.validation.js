import mongoose from "mongoose";

const chargeMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Charge name is required"],
      trim: true,
      minlength: 3,
    },

    code: {
      type: String,
      required: [true, "Charge code is required"],
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]+$/, "Invalid charge code format"],
    },

    chargeType: {
      type: String,
      required: true,
      enum: [
        "OPD",
        "IPD",
        "EMERGENCY",
        "APPOINTMENT",
        "LAB",
        "PROCEDURE",
        "SERVICE",
      ],
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    /* ================= GST ================= */

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
      validate: {
        validator: function (v) {
          return !this.gstApplicable || !!v;
        },
        message: "HSN/SAC code is required when GST is applicable",
      },
    },

    taxInclusive: {
      type: Boolean,
      default: false,
    },

    /* ======================================= */

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
      validate: {
        validator: function (v) {
          return !v || v > this.effectiveFrom;
        },
        message: "effectiveTo must be greater than effectiveFrom",
      },
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

export default chargeMasterSchema;
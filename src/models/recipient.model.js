import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    salary: { type: Number, default: null },

    shift: {
      type: String,
      enum: ["day", "night", "both"],
      default: "day",
    },

    time: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    emergencyContact: {
      type: String,
      default: null,
    },

    aadharNumber: {
      type: String,
      default: null,
    },

    panNumber: {
      type: String,
      default: null,
    },

    note: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipient", RecipientSchema);

import mongoose from "mongoose";

const feesMasterSchema = new mongoose.Schema(
  {
    opd_old: {
      type: Number,
      required: true,
      default: 200,
      min: [0, "OPD old fee cannot be negative"]
    },
    opd_new: {
      type: Number,
      required: true,
      default: 500,
      min: [0, "OPD new fee cannot be negative"]
    },

    ipd_old: {
      type: Number,
      required: true,
      default: 500,
      min: [0, "IPD old fee cannot be negative"]
    },
    ipd_new: {
      type: Number,
      required: true,
      default: 1000,
      min: [0, "IPD new fee cannot be negative"]
    },

    appointment_old: {
      type: Number,
      required: true,
      default: 500,
      min: [0, "Appointment old fee cannot be negative"]
    },
    appointment_new: {
      type: Number,
      required: true,
      default: 900,
      min: [0, "Appointment new fee cannot be negative"]
    },

    emergency: {
      type: Number,
      required: true,
      default: 800,
      min: [0, "Emergency fee cannot be negative"]
    },
  },
  { timestamps: true }
);

// Ensures only ONE master document exists
feesMasterSchema.statics.getMaster = async function () {
  let master = await this.findOne();
  if (!master) {
    master = await this.create({});
  }
  return master;
};

export default mongoose.model("FeesMaster", feesMasterSchema);

import mongoose from "mongoose";

const occupiedBedSchema = new mongoose.Schema(
  {
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BedMaster",
      required: true,
      unique: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    ipdAdmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    occupiedFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },

    occupiedTo: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("OccupiedBed", occupiedBedSchema);

import mongoose from "mongoose";

const bedMasterSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WardMaster",
      required: true,
      index: true,
    },

    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FloorMaster",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
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

bedMasterSchema.index(
  { ward: 1, roomNumber: 1, bedNumber: 1 },
  { unique: true }
);

export default mongoose.model("BedMaster", bedMasterSchema);

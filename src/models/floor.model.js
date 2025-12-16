import mongoose from "mongoose";

const floorMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    floorNumber: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },

    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("FloorMaster", floorMasterSchema);

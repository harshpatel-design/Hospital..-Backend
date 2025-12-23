import mongoose from "mongoose";

const bedMasterSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    bedType: {
      type: String,
      enum: [
        "GENERAL",
        "ICU",
        "VENTILATOR",
        "PRIVATE",
        "DELUXE",
        "PEDIATRIC",
      ],
      required: true,
      index: true,
    },

    /** BED LOCATION TYPE */
    bedLocationType: {
      type: String,
      enum: ["WARD", "ROOM"],
      required: true,
      index: true,
    },

    /** IF BED BELONGS TO WARD */
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WardMaster",
      default: null,
      index: true,
    },

    /** IF BED BELONGS TO ROOM */
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomNumber",
      default: null,
      index: true,
    },

    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FloorMaster",
      required: true,
      index: true,
    },

    isOccupied: {
      type: Boolean,
      default: false,
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
  }
);

bedMasterSchema.index({ ward: 1, isActive: 1 });
bedMasterSchema.index({ room: 1, isActive: 1 });

export default mongoose.model("BedMaster", bedMasterSchema);

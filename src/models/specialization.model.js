import mongoose from "mongoose";

const specializationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        description: {
            type: String,
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

export default mongoose.model("Specialization", specializationSchema);

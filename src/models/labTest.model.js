import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
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
            unique: true,
        },

        category: {
            type: String,
            enum: [
                "PATHOLOGY",
                "RADIOLOGY",
                "MICROBIOLOGY",
                "BIOCHEMISTRY",
                "HEMATOLOGY",
                "IMMUNOLOGY"
            ],
            required: true,
            index: true,
        },

        unit: {
            type: String,
            default: null,
        },

        normalRange: {
            type: String,
            default: null,
        },

        sampleType: {
            type: String,
            default: "Blood",
        },

        turnaroundTime: {
            type: Number,
            default: 24,     // hours
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

labTestSchema.index({ category: 1, isActive: 1 });

export default mongoose.model("LabTest", labTestSchema);

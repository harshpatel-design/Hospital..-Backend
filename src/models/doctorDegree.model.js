import mongoose from "mongoose";

const doctorDegreeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        shortName: {
            type: String,
            trim: true,
        },
        level: {
            type: String,
            enum: ["UG", "PG", "DIPLOMA", "SUPER_SPECIALITY"],
            default: "UG",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("DoctorDegree", doctorDegreeSchema);

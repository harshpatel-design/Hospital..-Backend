import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        appointmentDate: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

            status: {
                type: String,
                enum: ["scheduled", "completed", "cancelled", "no-show"],
                default: "scheduled",
            },

        type: {
            type: String,
            enum: ["consultation", "follow-up", "check-up", "procedure", "other"],
            default: "consultation",
        },

        reason: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for faster search
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

// Virtual duration
appointmentSchema.virtual("duration").get(function () {
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    return (end - start) / (1000 * 60);
});

// Prevent overlapping appointments
appointmentSchema.pre("save", async function (next) {
    if (this.isModified(["startTime", "endTime", "appointmentDate"])) {
        const start = new Date(`2000-01-01T${this.startTime}`);
        const end = new Date(`2000-01-01T${this.endTime}`);

        if (start >= end) {
            throw new Error("End time must be after start time");
        }

        const conflict = await this.constructor.findOne({
            _id: { $ne: this._id },
            doctor: this.doctor,
            appointmentDate: this.appointmentDate,
            status: { $ne: "cancelled" },
            startTime: { $lt: this.endTime },
            endTime: { $gt: this.startTime },
        });

        if (conflict) {
            throw new Error("Doctor has a conflicting appointment at this time");
        }
    }

    next();
});

export default mongoose.model("Appointment", appointmentSchema);

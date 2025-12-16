import mongoose from "mongoose";

const serviceNameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Ensure unique index on name (your unique:true alone is not enough)
serviceNameSchema.index({ name: 1 }, { unique: true });

// Clean readable duplicate error
serviceNameSchema.post("save", function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error("Service name already exists"));
    } else {
        next(error);
    }
});

const ServiceName = mongoose.model("ServiceName", serviceNameSchema);

export default ServiceName;

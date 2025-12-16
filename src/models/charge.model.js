import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema(
    {
        // Who is billed
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            index: true,
        },

        // Optional doctor reference
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            index: true,
        },

        // Which master price was used
        chargeMaster: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChargeMaster",
            required: true,
        },

        // OPD / IPD / Emergency
        caseType: {
            type: String,
            enum: ["opd", "ipd", "emergency", "appointment"],
            required: true,
            index: true,
        },

        // Snapshot amount (never change later)
        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        // Payment tracking
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        balanceAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: ["unpaid", "partial", "paid"],
            default: "unpaid",
            index: true,
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

chargeSchema.pre("save", function (next) {
    if (this.paidAmount > this.amount) {
        return next(new Error("Paid amount cannot exceed total amount"));
    }

    this.balanceAmount = this.amount - this.paidAmount;

    if (this.balanceAmount === 0) {
        this.paymentStatus = "paid";
    } else if (this.paidAmount > 0) {
        this.paymentStatus = "partial";
    }

    next();
});

export default mongoose.model("Charge", chargeSchema);

import mongoose from "mongoose";

const roomNumberSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            trim: true,
        },

        floor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FloorMaster",
            required: [true, "Floor reference is required"],
            index: true,
        },

        roomType: {
            type: String,
            enum: [
                "GENERAL",
                "PRIVATE",
                "DELUXE",
                "SUITE",
                "ICU",
                "NICU",
                "PICU",
                "ISOLATION",
                "OPERATION_THEATRE",
                "RECOVERY",
                "EMERGENCY",
            ],
            required: [true, "Room type is required"],
        },

        capacity: {
            type: Number,
            required: [true, "Room capacity is required"],
            min: [1, "Room capacity must be at least 1"],
        },

        occupiedBeds: {
            type: Number,
            default: 0,
            validate: {
                validator: function (value) {
                    return value <= this.capacity;
                },
                message: "Occupied beds cannot exceed room capacity",
            },
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        amenities: [{
            type: String,
            trim: true,
        }],

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"],
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
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret.id;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret.id;
            },
        },
    }
);

/**
 * ✅ UNIQUE only for ACTIVE rooms
 */
roomNumberSchema.index(
    { roomNumber: 1, floor: 1 },
    {
        unique: true,
        partialFilterExpression: { isActive: true },
    }
);

/**
 * 🔍 Query performance indexes
 */
roomNumberSchema.index({ roomType: 1, isActive: 1 });
roomNumberSchema.index({ floor: 1, isActive: 1 });

/**
 * 🛏 Available beds virtual
 */
roomNumberSchema.virtual("availableBeds").get(function () {
    return this.capacity - this.occupiedBeds;
});

/**
 * 🔗 Bed relationship
 */
roomNumberSchema.virtual("beds", {
    ref: "BedMaster",
    localField: "_id",
    foreignField: "room",
});

export default mongoose.model("RoomNumber", roomNumberSchema);

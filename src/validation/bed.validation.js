import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid ObjectId");
    }
    return value;
});

export const createBedValidation = Joi.object({
    bedNumber: Joi.string()
        .trim()
        .uppercase()
        .min(1)
        .max(20)
        .required()
        .messages({
            "string.empty": "Bed number is required",
        }),

    bedType: Joi.string()
        .valid(
            "GENERAL",
            "ICU",
            "VENTILATOR",
            "PEDIATRIC",
            "NEONATAL",
            "FOWLER"
        )
        .required()
        .messages({
            "any.only": "Invalid bed type",
        }),

    bedLocationType: Joi.string()
        .valid("WARD", "ROOM")
        .required()
        .messages({
            "any.only": "Bed location type must be WARD or ROOM",
        }),

    /* ===== CONDITIONAL WARD ===== */
    ward: objectId.when("bedLocationType", {
        is: "WARD",
        then: Joi.required().messages({
            "any.required": "Ward is required when bed location is WARD",
        }),
        otherwise: Joi.forbidden().messages({
            "any.unknown": "Ward is not allowed when bed location is ROOM",
        }),
    }),

    /* ===== CONDITIONAL ROOM ===== */
    room: objectId.when("bedLocationType", {
        is: "ROOM",
        then: Joi.required().messages({
            "any.required": "Room is required when bed location is ROOM",
        }),
        otherwise: Joi.forbidden().messages({
            "any.unknown": "Room is not allowed when bed location is WARD",
        }),
    }),

    floor: objectId.required().messages({
        "any.required": "Floor is required",
    }),

    isOccupied: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),

    notes: Joi.string().allow("", null).max(500),
});


export const updateBedValidation = Joi.object({
    bedNumber: Joi.string()
        .trim()
        .uppercase()
        .min(1)
        .max(20)
        .messages({
            "string.empty": "Bed number cannot be empty",
        }),

    bedType: Joi.string().valid(
        "GENERAL",
        "ICU",
        "VENTILATOR",
        "PEDIATRIC",
        "NEONATAL",
        "FOWLER"
    ),

    bedLocationType: Joi.string()
        .valid("WARD", "ROOM")
        .messages({
            "any.only": "Bed location type must be WARD or ROOM",
        }),

    ward: objectId.allow(null),

    room: objectId.allow(null),

    floor: objectId,

    isOccupied: Joi.boolean(),

    isActive: Joi.boolean(),

    notes: Joi.string()
        .allow("", null)
        .max(500)
        .messages({
            "string.max": "Notes cannot exceed 500 characters",
        }),
})

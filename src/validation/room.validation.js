import Joi from "joi";
import mongoose from "mongoose";

/**
 * 🔹 ObjectId validation helper
 */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
});

/**
 * 🏥 Create Room validation
 */
export const createRoomValidation = Joi.object({
  roomNumber: Joi.string()
    .trim()
    .min(1)
    .max(20)
    .required()
    .messages({
      "string.empty": "Room number is required",
      "string.max": "Room number cannot exceed 20 characters",
    }),

  floor: objectId
    .required()
    .messages({
      "any.required": "Floor reference is required",
    }),

  roomType: Joi.string()
    .valid(
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
      "EMERGENCY"
    )
    .required()
    .messages({
      "any.only": "Invalid room type",
      "any.required": "Room type is required",
    }),

  capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Room capacity must be a number",
      "number.min": "Room capacity must be at least 1",
      "any.required": "Room capacity is required",
    }),

  occupiedBeds: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .custom((value, helpers) => {
      const { capacity } = helpers.state.ancestors[0];
      if (capacity !== undefined && value > capacity) {
        return helpers.message("Occupied beds cannot exceed room capacity");
      }
      return value;
    }),

  amenities: Joi.array()
    .items(Joi.string().trim())
    .default([]),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow("", null)
    .messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),

  isActive: Joi.boolean().default(true),
});

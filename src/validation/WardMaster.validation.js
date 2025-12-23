import Joi from "joi";
import mongoose from "mongoose";

/* ================= OBJECT ID VALIDATOR ================= */

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
});

/* ================= CREATE WARD ================= */

export const createWardValidation = Joi.object({
  name: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Ward name is required",
      "string.min": "Ward name must be at least 2 characters",
      "string.max": "Ward name cannot exceed 100 characters",
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9-]+$/)
    .required()
    .messages({
      "string.empty": "Ward code is required",
      "string.pattern.base": "Invalid ward code format",
    }),

  wardType: Joi.string()
    .valid(
      "GENERAL",
      "SEMI_PRIVATE",
      "PRIVATE",
      "DELUXE",
      "SUITE",
      "ICU",
      "NICU",
      "PICU",
      "CCU",
      "HDU",
      "ISOLATION",
      "BURN",
      "DAY_CARE"
    )
    .required()
    .messages({
      "any.only": "Invalid ward type",
      "any.required": "Ward type is required",
    }),

  department: objectId
    .allow(null)
    .optional()
    .messages({
      "string.custom": "Invalid department reference",
    }),

  floor: objectId
    .required()
    .messages({
      "any.required": "Floor reference is required",
      "string.custom": "Invalid floor reference",
    }),

  notes: Joi.string()
    .trim()
    .max(500)
    .allow("", null)
    .messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
});


export const updateWardValidation = Joi.object({
  name: Joi.string().trim().uppercase().min(2).max(100),
  wardType: Joi.string().valid(
    "GENERAL",
    "SEMI_PRIVATE",
    "PRIVATE",
    "DELUXE",
    "SUITE",
    "ICU",
    "NICU",
    "PICU",
    "CCU",
    "HDU",
    "ISOLATION",
    "BURN",
    "DAY_CARE"
  ),
  department: objectId.allow(null),
  floor: objectId,
  isActive: Joi.boolean(),
  notes: Joi.string().trim().max(500).allow("", null),
}).min(1);

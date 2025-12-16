import Joi from "joi";

/* ================= CREATE FLOOR ================= */

export const createFloorValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Floor name is required",
      "string.min": "Floor name must be at least 2 characters",
      "string.max": "Floor name cannot exceed 50 characters",
    }),

  code: Joi.string()
    .uppercase()
    .pattern(/^[A-Z0-9-]+$/)
    .required()
    .messages({
      "string.empty": "Floor code is required",
      "string.pattern.base": "Invalid floor code format",
    }),

  floorNumber: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Floor number must be a number",
      "number.integer": "Floor number must be an integer",
      "number.min": "Floor number cannot be negative",
    }),

  notes: Joi.string()
    .allow("", null)
    .max(500)
    .messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
});

export const updateFloorValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50),

  code: Joi.string()
    .uppercase()
    .pattern(/^[A-Z0-9-]+$/),

  floorNumber: Joi.number()
    .integer()
    .min(0),

  notes: Joi.string()
    .allow("", null)
    .max(500),
});

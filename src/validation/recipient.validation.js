import Joi from "joi";

export const createRecipientSchema = Joi.object({
  // USER FIELDS
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone must be a valid 10-digit number")
    .optional(),

  gender: Joi.string().valid("male", "female", "other").optional(),

  age: Joi.number().min(1).max(120).optional(),

  // RECIPIENT FIELDS
  salary: Joi.number().min(0).max(1000000).optional(),

  shift: Joi.string()
    .valid("day", "night", "both")
    .optional(),

  time: Joi.string().optional(), // "10 AM - 6 PM"

  address: Joi.string().max(200).optional(),

  emergencyContact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Emergency contact must be a valid 10-digit number")
    .optional(),

  aadharNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .message("Aadhar number must be a valid 12-digit number")
    .optional(),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .message("Invalid PAN number format")
    .optional(),

  note: Joi.string().max(500).optional(),

  status: Joi.string().valid("active", "inactive").optional()
});


// UPDATE schema (all optional)
export const updateRecipientSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone must be a valid 10-digit number")
    .optional(),

  gender: Joi.string().valid("male", "female", "other").optional(),

  age: Joi.number().min(1).max(120).optional(),

  // Recipient Fields
  salary: Joi.number().min(0).max(1000000).optional(),

  shift: Joi.string().valid("day", "night", "both").optional(),

  time: Joi.string().optional(),

  address: Joi.string().max(200).optional(),

  emergencyContact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  aadharNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .optional(),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional(),

  note: Joi.string().max(500).optional(),

  status: Joi.string().valid("active", "inactive").optional()
});

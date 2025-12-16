import Joi from "joi";

export const createDoctorSchema = Joi.object({
  // ✅ USER FIELDS (MISSING BEFORE)
  name: Joi.string().trim().min(1).max(24).required().messages({
    "string.empty": "Doctor name is required",
    "any.required": "Doctor name is required"
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "any.required": "Email is required"
  }),

  phone: Joi.string().length(10).required().messages({
    "string.length": "Phone must be 10 digits",
    "any.required": "Phone is required"
  }),

  gender: Joi.string().valid("male", "female", "other").required(),

  // -------------------------
  // PROFESSIONAL INFORMATION
  // -------------------------
  specialization: Joi.string().required(),

  department: Joi.string().required(),

  experience: Joi.number().integer().min(0).required(),

  // -------------------------
  // OPTIONAL FIELDS
  // -------------------------
  bio: Joi.string().allow("").optional(),

  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institute: Joi.string().required(),
      year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
    })
  ).optional(),

  availability: Joi.object({
    monday: Joi.boolean().default(false),
    tuesday: Joi.boolean().default(false),
    wednesday: Joi.boolean().default(false),
    thursday: Joi.boolean().default(false),
    friday: Joi.boolean().default(false),
    saturday: Joi.boolean().default(false),
    sunday: Joi.boolean().default(false)
  }).default(),

  status: Joi.string().valid("active", "inactive").default("active")
});


export const updateDoctorSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().length(10).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  age: Joi.number().optional(),

  specialization: Joi.string().optional(),
  department: Joi.string().optional(),
  experience: Joi.number().optional(),

  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institute: Joi.string().required(),
      year: Joi.number().required(),
    })
  ).optional(),

  availability: Joi.object({
    monday: Joi.boolean().optional(),
    tuesday: Joi.boolean().optional(),
    wednesday: Joi.boolean().optional(),
    thursday: Joi.boolean().optional(),
    friday: Joi.boolean().optional(),
    saturday: Joi.boolean().optional(),
    sunday: Joi.boolean().optional(),
  }).optional(),

  status: Joi.string().valid("active", "inactive").optional(),
}).min(1); // 🔥 at least one field required

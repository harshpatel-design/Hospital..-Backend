import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("admin", "doctor", "patient", "medical_store", "lab")
    .optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  age: Joi.number().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  age: Joi.number().optional(),
});

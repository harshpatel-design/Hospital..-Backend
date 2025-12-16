import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "doctor", "patient", "medical_store", "lab").optional(),
    phone: Joi.string().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    age: Joi.number().integer().min(0).optional()
});





export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});


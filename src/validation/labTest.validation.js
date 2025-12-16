import Joi from "joi";

/* ================= COMMON ================= */

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/* ================= CREATE LAB TEST ================= */

export const createLabTestValidation = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Lab test name is required",
            "string.min": "Lab test name must be at least 2 characters",
            "any.required": "Lab test name is required",
        }),

    code: Joi.string()
        .trim()
        .uppercase()
        .regex(/^[A-Z0-9_]+$/)
        .required()
        .messages({
            "string.pattern.base": "Lab test code must contain only uppercase letters, numbers or underscore",
            "any.required": "Lab test code is required",
        }),

    category: Joi.string()
        .valid(
            "PATHOLOGY",
            "RADIOLOGY",
            "MICROBIOLOGY",
            "BIOCHEMISTRY",
            "HEMATOLOGY",
            "IMMUNOLOGY"
        )
        .required()
        .messages({
            "any.only": "Invalid lab test category",
            "any.required": "Lab test category is required",
        }),

    unit: Joi.string()
        .allow("", null)
        .messages({
            "string.base": "Unit must be a string",
        }),

    normalRange: Joi.string()
        .allow("", null)
        .messages({
            "string.base": "Normal range must be a string",
        }),

    sampleType: Joi.string()
        .allow("", null)
        .default("Blood"),

    turnaroundTime: Joi.number()
        .integer()
        .min(1)
        .max(168) // max 7 days
        .default(24)
        .messages({
            "number.base": "Turnaround time must be a number (hours)",
        }),

    isActive: Joi.boolean().default(true),

    createdBy: Joi.string()
        .regex(objectIdPattern)
        .required()
        .messages({
            "string.pattern.base": "Invalid createdBy ID format",
            "any.required": "createdBy is required",
        }),
});

/* ================= UPDATE LAB TEST ================= */

export const updateLabTestValidation = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    category: Joi.string().valid(
        "PATHOLOGY",
        "RADIOLOGY",
        "MICROBIOLOGY",
        "BIOCHEMISTRY",
        "HEMATOLOGY",
        "IMMUNOLOGY"
    ),

    unit: Joi.string().allow("", null),

    normalRange: Joi.string().allow("", null),

    sampleType: Joi.string().allow("", null),

    turnaroundTime: Joi.number()
        .integer()
        .min(1)
        .max(168),

    isActive: Joi.boolean(),

    updatedBy: Joi.string()
        .regex(objectIdPattern)
        .required()
        .messages({
            "string.pattern.base": "Invalid updatedBy ID format",
            "any.required": "updatedBy is required",
        }),
});

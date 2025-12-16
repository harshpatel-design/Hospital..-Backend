import Joi from "joi";

/* ------------------------------------------------------
   IMPORTANT:
   You are storing `serviceName` and `department` as
   plain strings (not ObjectIds), so validation should
   allow normal strings.
------------------------------------------------------ */

export const createServiceSchema = Joi.object({
    
    serviceName: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": "Service name must be a string",
            "any.required": "Service name is required",
        }),

    department: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": "Department must be a string",
            "any.required": "Department is required",
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
            "any.required": "Price is required",
        }),

    description: Joi.string().allow("", null),

    isActive: Joi.boolean().optional(),
});

/* ------------------------------------------------------
   UPDATE SCHEMA
------------------------------------------------------ */
export const updateServiceSchema = Joi.object({
    
    serviceName: Joi.string()
        .trim()
        .optional()
        .messages({
            "string.base": "Service name must be a string",
        }),

    department: Joi.string()
        .trim()
        .optional()
        .messages({
            "string.base": "Department must be a string",
        }),

    price: Joi.number()
        .min(0)
        .optional()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
        }),

    description: Joi.string().allow("", null).optional(),

    isActive: Joi.boolean().optional(),
});

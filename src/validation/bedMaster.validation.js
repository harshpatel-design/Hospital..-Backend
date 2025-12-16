import Joi from 'joi';

const bedValidationSchema = Joi.object({
    bedNumber: Joi.string()
        .trim()
        .required()
        .pattern(/^[A-Z0-9-]+$/)
        .messages({
            'string.empty': 'Bed number is required',
            'string.pattern.base': 'Invalid bed number format. Use alphanumeric characters and hyphens only',
        }),

    ward: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.empty': 'Ward ID is required',
            'string.pattern.base': 'Invalid ward ID format',
        }),

    floor: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.empty': 'Floor ID is required',
            'string.pattern.base': 'Invalid floor ID format',
        }),

    roomNumber: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Room number is required',
        }),

    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'isActive must be a boolean value',
        }),
});

export const createBedValidation = bedValidationSchema;

export const updateBedValidation = Joi.object({
    bedNumber: Joi.string()
        .trim()
        .pattern(/^[A-Z0-9-]+$/)
        .messages({
            'string.pattern.base': 'Invalid bed number format. Use alphanumeric characters and hyphens only',
        }),

    ward: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Invalid ward ID format',
        }),

    floor: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Invalid floor ID format',
        }),

    roomNumber: Joi.string()
        .trim(),

    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'isActive must be a boolean value',
        }),
}).min(1);

export const bulkCreateBedValidation = Joi.array().items(
    bedValidationSchema
).min(1).messages({
    'array.min': 'At least one bed must be provided',
    'array.includesRequiredUnknowns': 'Each bed must include all required fields',
});
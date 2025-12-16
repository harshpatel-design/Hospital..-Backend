import Joi from "joi";

// Time format HH:MM (24-hour)
const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createAppointmentValidation = Joi.object({
    patient: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid patient ID format"),

    doctor: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid doctor ID format"),

    appointmentDate: Joi.date()
        .required()
        .messages({
            "date.base": "Appointment date must be valid",
            "any.required": "Appointment date is required",
        }),

    startTime: Joi.string()
        .required()
        .pattern(timePattern)
        .messages({
            "string.pattern.base": "Invalid startTime format (HH:MM)",
            "any.required": "Start time is required",
        }),

    endTime: Joi.string()
        .required()
        .pattern(timePattern)
        .messages({
            "string.pattern.base": "Invalid endTime format (HH:MM)",
            "any.required": "End time is required",
        }),

    status: Joi.string()
        .valid("scheduled", "completed", "cancelled", "no-show")
        .default("scheduled"),

    type: Joi.string()
        .valid("consultation", "follow-up", "check-up", "procedure", "other")
        .default("consultation"),

    reason: Joi.string().allow("", null),
    notes: Joi.string().allow("", null),

    createdBy: Joi.string()
        .required()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid createdBy ID format"),

    updatedBy: Joi.string()
        .allow(null, "")
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid updatedBy ID format"),

    isActive: Joi.boolean().default(true),
});


export const updateAppointmentValidation = Joi.object({
    patient: Joi.string().regex(/^[0-9a-fA-F]{24}$/),

    doctor: Joi.string().regex(/^[0-9a-fA-F]{24}$/),

    appointmentDate: Joi.date(),

    startTime: Joi.string().pattern(timePattern),

    endTime: Joi.string().pattern(timePattern),

    status: Joi.string().valid("scheduled", "completed", "cancelled", "no-show"),

    type: Joi.string().valid("consultation", "follow-up", "check-up", "procedure", "other"),

    reason: Joi.string().allow("", null),
    notes: Joi.string().allow("", null),

    updatedBy: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid updatedBy ID"),

    isActive: Joi.boolean(),
});

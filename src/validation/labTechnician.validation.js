import Joi from "joi";
import JoiObjectId from "joi-objectid";

Joi.objectId = JoiObjectId(Joi);

export const createLabTechnicianValidation = Joi.object({
  // USER-LIKE FIELDS
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone must be a valid 10-digit number")
    .required(),

  gender: Joi.string().valid("male", "female", "other").optional(),

  age: Joi.number()
    .min(18)
    .max(80)
    .optional(),

  // REFERENCE FIELDS
  user: Joi.objectId().optional(),
  lab: Joi.objectId().optional(),

  // PROFESSIONAL DATA
  specialization: Joi.string().min(2).max(100).required(),

  qualifications: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().min(2).max(100).optional(),
        institute: Joi.string().min(2).max(150).optional(),
        year: Joi.number()
          .min(1950)
          .max(new Date().getFullYear())
          .optional()
      })
    )
    .optional(),

  experience: Joi.object({
    years: Joi.number().min(0).max(60).optional(),
    previousLabs: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().optional(),
          position: Joi.string().optional(),
          workedFrom: Joi.date().optional(),
          workedTo: Joi.date().optional()
        })
      )
      .optional()
  }).optional(),

  skills: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        level: Joi.string().valid("beginner", "intermediate", "expert").optional()
      })
    )
    .optional(),

  shift: Joi.string()
    .valid("morning", "evening", "night", "rotational")
    .optional(),

  workSchedule: Joi.object({
    monday: Joi.boolean(),
    tuesday: Joi.boolean(),
    wednesday: Joi.boolean(),
    thursday: Joi.boolean(),
    friday: Joi.boolean(),
    saturday: Joi.boolean(),
    sunday: Joi.boolean()
  }).optional(),

  assignedTests: Joi.array()
    .items(
      Joi.object({
        testId: Joi.objectId().optional(),
        assignedAt: Joi.date().optional()
      })
    )
    .optional(),

  certifications: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().optional(),
        issuedBy: Joi.string().optional(),
        issueDate: Joi.date().optional(),
        expiryDate: Joi.date().optional(),
        certificateUrl: Joi.string().uri().optional()
      })
    )
    .optional(),

  documents: Joi.array()
    .items(
      Joi.object({
        docType: Joi.string().required(),
        url: Joi.string().uri().required(),
        uploadedAt: Joi.date().optional()
      })
    )
    .optional(),

  status: Joi.string().valid("active", "inactive").optional()
});

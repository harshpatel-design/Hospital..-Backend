import Joi from "joi";

// Nested Schemas --------------------------------------

const addressSchema = Joi.object({
  line1: Joi.string().allow(null, "").optional(),
  line2: Joi.string().allow(null, "").optional(),
  city: Joi.string().allow(null, "").optional(),
  state: Joi.string().allow(null, "").optional(),
  zip: Joi.string().allow(null, "").optional(),
  country: Joi.string().default("India"),
});

const opdSchema = Joi.object({
  doctor: Joi.string().allow("", null).optional(),
  visitReason: Joi.string().allow("", null).optional(),
  visitCount: Joi.number().optional(),
  lastVisit: Joi.date().optional(),
});

const ipdSchema = Joi.object({
  doctor: Joi.string().allow("", null).optional(),
  ward: Joi.string().allow("", null).optional(),
  roomNumber: Joi.string().allow("", null).optional(),
  bedNumber: Joi.string().allow("", null).optional(),
  admissionDate: Joi.date().optional(),
  dischargeDate: Joi.date().optional(),
  dischargeSummary: Joi.string().allow("", null).optional(),
});

const emergencySchema = Joi.object({
  level: Joi.string().valid("low", "medium", "high").optional(),
  broughtBy: Joi.string().allow("", null).optional(),
  conditionNotes: Joi.string().allow("", null).optional(),
});

const vitalsSchema = Joi.object({
  height: Joi.number().optional(),
  weight: Joi.number().optional(),
  temperature: Joi.string().optional(),
  bloodPressure: Joi.string().optional(),
  pulse: Joi.string().optional(),
  spo2: Joi.string().optional(),
});

const insuranceSchema = Joi.object({
  provider: Joi.string().allow("", null).optional(),
  policyNumber: Joi.string().allow("", null).optional(),
  expiryDate: Joi.date().optional(),
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().allow("", null).optional(),
  phone: Joi.string().allow("", null).optional(),
  relation: Joi.string().allow("", null).optional(),
});

const guardianSchema = Joi.object({
  name: Joi.string().allow("", null).optional(),
  phone: Joi.string().allow("", null).optional(),
  relation: Joi.string().allow("", null).optional(),
});

const medicationSchema = Joi.array().items(
  Joi.object({
    name: Joi.string().required(),
    dosage: Joi.string().required(),
    frequency: Joi.string().required(),
  })
);

const documentsSchema = Joi.array().items(
  Joi.object({
    fileName: Joi.string().optional(),
    fileUrl: Joi.string().optional(),
    fileType: Joi.string().optional(),
    uploadedAt: Joi.date().optional(),
  })
);

// Main Patient Schema ----------------------------------

export const createPatientValidation = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),

  lastName: Joi.string().allow("", null).optional(),

  gender: Joi.string().valid("male", "female", "other").required(),
  dob: Joi.date().allow(null, "").optional(),
  altPhone: Joi.string().allow("", null).optional(),
  age: Joi.number().optional(),

  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),

  email: Joi.string().email().optional(),

  address: addressSchema.optional(),

  case: Joi.string()
    .valid("old", "new")
    .default("new")   // <-- default value
    .messages({
      'string.empty': 'Case type cannot be empty',
      'any.only': 'Case must be either "old" or "new"',
    }),
  caseType: Joi.string()
    .valid("opd", "ipd", "emergency", "appointment")
    .required(),

  opd: opdSchema.optional(),
  ipd: ipdSchema.optional(),

  appointmentId: Joi.string().hex().length(24).optional(),

  emergency: emergencySchema.optional(),

  bloodGroup: Joi.string().optional(),

  allergies: Joi.array().items(Joi.string()).optional(),

  medicalHistory: Joi.array().items(Joi.string()).optional(),

  chronicDiseases: Joi.array().items(Joi.string()).optional(),

  medications: medicationSchema.optional(),

  vitals: vitalsSchema.optional(),

  insurance: insuranceSchema.optional(),

  emergencyContact: emergencyContactSchema.optional(),

  guardian: guardianSchema.optional(),

  documents: documentsSchema.optional(),
  notes: Joi.string().optional(),

  createdBy: Joi.string().hex().length(24).optional(),

  isActive: Joi.boolean().optional(),
});

// Update Validation (All Optional)
export const updatePatientValidation = createPatientValidation.fork(
  Object.keys(createPatientValidation.describe().keys),
  (schema) => schema.optional()
);

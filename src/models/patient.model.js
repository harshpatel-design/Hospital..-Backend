import mongoose from "mongoose";
import Doctor from "./doctor.model.js"; // REQUIRED for fee lookup

const addressSchema = new mongoose.Schema({
  line1: { type: String, default: "" },
  line2: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "India" },
});

const opdSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  visitReason: { type: String, default: "" },
  visitCount: { type: Number, default: 0 },
  lastVisit: { type: Date },
});

const ipdSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  ward: { type: String, default: "" },
  roomNumber: { type: String, default: "" },
  bedNumber: { type: String, default: "" },
  admissionDate: { type: Date },
  dischargeDate: { type: Date },
  dischargeSummary: { type: String, default: "" },
});

const emergencySchema = new mongoose.Schema({
  level: { type: String, enum: ["low", "medium", "high"], default: "low" },
  broughtBy: { type: String, default: "" },
  conditionNotes: { type: String, default: "" },
});

const vitalsSchema = new mongoose.Schema({
  height: { type: Number },
  weight: { type: Number },
  temperature: { type: String },
  bloodPressure: { type: String },
  pulse: { type: String },
  spo2: { type: String },
});

const insuranceSchema = new mongoose.Schema({
  provider: { type: String, default: "" },
  policyNumber: { type: String, default: "" },
  expiryDate: { type: Date },
});

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  relation: { type: String, default: "" },
});

const guardianSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  relation: { type: String, default: "" },
});

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
});

const documentsSchema = new mongoose.Schema({
  fileName: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    email: { type: String },
    address: addressSchema,
    caseType: {
      type: String,
      enum: ["opd", "ipd", "emergency", "appointment"],
      required: true,
    },
    case: {
      type: String,
      enum: ["old", "new"],
      default: "new",
      required: true
    },

    opd: opdSchema,
    ipd: ipdSchema,
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    emergency: emergencySchema,
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    medicalHistory: [{ type: String }],
    chronicDiseases: [{ type: String }],
    medications: [medicationSchema],
    vitals: vitalsSchema,
    insurance: insuranceSchema,
    emergencyContact: emergencyContactSchema,
    guardian: guardianSchema,
    documents: [documentsSchema],
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);

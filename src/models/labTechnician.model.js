import mongoose from "mongoose";

const LabTechnicianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: false
    },
    specialization: {
      type: String,
      required: true
    },
    qualifications: [
      {
        degree: String,
        institute: String,
        year: Number
      }
    ],
    experience: {
      years: Number,
      previousLabs: [
        {
          name: String,
          position: String,
          workedFrom: Date,
          workedTo: Date
        }
      ]
    },
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "expert"]
        }
      }
    ],
    shift: {
      type: String,
      enum: ["morning", "evening", "night", "rotational"],
      default: "morning"
    },

    workSchedule: {
      monday: Boolean,
      tuesday: Boolean,
      wednesday: Boolean,
      thursday: Boolean,
      friday: Boolean,
      saturday: Boolean,
      sunday: Boolean
    },

    assignedTests: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lab.tests"
        },
        assignedAt: Date
      }
    ],

    certifications: [
      {
        title: String,
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        certificateUrl: String
      }
    ],

    documents: [
      {
        docType: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("LabTechnician", LabTechnicianSchema);

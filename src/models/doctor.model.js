import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    specialization: { type: String, required: true },
    department: { type: String },
    experience: { type: Number, default: 0 },
    bio: { type: String },

    education: [
      {
        degree: String,
        institute: String,
        year: Number
      }
    ],

    availability: {
      monday: { type: Boolean, default: false },
      tuesday: { type: Boolean, default: false },
      wednesday: { type: Boolean, default: false },
      thursday: { type: Boolean, default: false },
      friday: { type: Boolean, default: false },
      saturday: { type: Boolean, default: false },
      sunday: { type: Boolean, default: false }
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);

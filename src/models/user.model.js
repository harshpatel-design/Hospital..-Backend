import mongoose from "mongoose";
import Counter from "./counter.model.js";

const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: false },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient", "medical_store", "lab_technician", "recipient"],
    default: "admin"
  },
  image: { type: String, default: null, required: false },
  phone: String,
  gender: String,
  age: Number,
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const counter = await Counter.findOneAndUpdate(
    { id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.userId = counter.seq;
  next();
});

export default mongoose.model("User", UserSchema);

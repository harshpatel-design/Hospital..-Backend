import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true },   // model name
  seq: { type: Number, default: 0 }        // auto increment value
});

export default mongoose.model("Counter", CounterSchema);

import mongoose from "mongoose";
delete mongoose.models.Lead;
const LeadSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  website: { type: String },
  signalCategory: { type: String }, // <-- Removed the enum restriction
  intentScore: { type: Number, min: 0, max: 100 },
  aiJustification: { type: String },
  rawSnippet: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
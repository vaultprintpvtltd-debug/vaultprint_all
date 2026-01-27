import mongoose from "mongoose";

const PrintSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },

  filePath: { type: String }, // 🔥 REQUIRED FOR PRINT

  otp: { type: String },
  otpExpiresAt: { type: Date },
  verified: { type: Boolean, default: false },

}, { timestamps: true });

export default mongoose.model("PrintSession", PrintSessionSchema);

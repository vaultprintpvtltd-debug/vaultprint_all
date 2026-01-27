import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  pages: Number,
  price: Number,
  options: {
    pages: Number,
    color: Boolean,
    duplex: Boolean,
    copies: Number,
  },
});

const printSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  status: { type: String, default: "WAITING" },

  otp: String,
  otpExpiresAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },

  file: fileSchema,

  printStatus: {
    type: String,
    enum: ["PENDING", "PRINTED"],
    default: "PENDING",
  },
});

export default mongoose.model("PrintSession", printSessionSchema);

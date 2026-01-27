import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import sessionRoutes from "./routes/session.js";
import printRoutes from "./routes/print.js";
import uploadRoutes from "./routes/upload.js";
import paymentRoutes from "./routes/payment.js";
import otpRoutes from "./routes/otp.js";
import sessionSummaryRoutes from "./routes/sessionSummary.js";

dotenv.config();

const app = express();

/* middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* routes */
app.use("/api/session", sessionRoutes);
app.use("/api/print", printRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/summary", sessionSummaryRoutes);

/* mongo */
mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err.message);
    console.error("Full error:", err);
  });

/* server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("MONGO_URI =", process.env.MONGO_URI);

import express from "express";
import PrintSession from "../models/PrintSession.js";
import { printDocument } from "../services/printerService.js";

const router = express.Router();

/* ================= GENERATE OTP ================= */
router.post("/generate-otp", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = await PrintSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.otp && session.otpExpiresAt > new Date()) {
      return res.json({ success: true, otp: session.otp });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    session.otp = otp;
    session.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    session.verified = false;

    await session.save();
    console.log("🔐 OTP GENERATED:", otp);

    res.json({ success: true, otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP generation failed" });
  }
});

/* ================= VERIFY OTP + PRINT ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    const session = await PrintSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.otp || session.otp !== String(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (session.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    session.verified = true;
    session.otp = null;
    session.otpExpiresAt = null;
    await session.save();

    console.log("✅ OTP VERIFIED");

    // 🖨️ REAL PRINT
    await printDocument(session.filePath, session.sessionId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

router.post("/generate-otp", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PrintSession.findOneAndUpdate(
      { sessionId },
      {
        otp,
        otpExpiresAt: expiresAt,
        verified: false,
      },
      { upsert: true }
    );

    console.log("🔐 OTP GENERATED:", otp);

    res.json({ success: true, otp });
  } catch (err) {
    console.error("❌ OTP GENERATION FAILED:", err);
    res.status(500).json({ error: "OTP generation failed" });
  }
});




router.post("/verify-otp", async (req, res) => {
  const { sessionId, otp } = req.body;

  console.log("🧪 VERIFY OTP");
  console.log("Session ID:", sessionId);
  console.log("OTP Received:", otp);

  const session = await PrintSession.findOne({ sessionId });

  if (!session) {
    console.log("❌ Session not found");
    return res.status(400).json({ message: "Session not found" });
  }

  console.log("Stored OTP:", session.otp);
  console.log("Expires At:", session.otpExpiresAt);
  console.log("Now:", new Date());

  if (session.otpExpiresAt < new Date()) {
    console.log("❌ OTP EXPIRED");
    return res.status(400).json({ message: "OTP expired" });
  }

  if (session.otp !== otp) {
    console.log("❌ INVALID OTP");
    return res.status(401).json({ message: "Invalid OTP" });
  }

  session.verified = true;
  session.otp = null;
  await session.save();

  console.log("✅ OTP VERIFIED");

  res.json({ success: true });
});

export default router;

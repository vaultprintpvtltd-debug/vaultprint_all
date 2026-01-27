// src/routes/payment.js
import express from "express";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

/**
 * POST /api/session/:sessionId/pay
 * Marks session as paid & locks it
 */
router.post("/:sessionId/pay", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await PrintSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.locked) {
      return res.status(400).json({ error: "Session already locked" });
    }

    // 🔒 Lock the session after payment
    session.paid = true;
    session.locked = true;

    await session.save();

    res.json({
      success: true,
      message: "Payment successful. Session locked.",
      sessionId
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

export default router;

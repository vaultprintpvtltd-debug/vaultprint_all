// src/routes/sessionSummary.js
import express from "express";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

/**
 * GET /api/session/summary/:sessionId
 */
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await PrintSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const totalPages = session.files.reduce(
      (sum, file) => sum + file.pages,
      0
    );

    const totalPrice = session.files.reduce(
      (sum, file) => sum + file.price,
      0
    );

    res.json({
      sessionId: session.sessionId,
      files: session.files,
      totalPages,
      totalPrice,
      locked: session.locked,
      paid: session.paid
    });
  } catch (err) {
    console.error("Session summary error:", err);
    res.status(500).json({ error: "Failed to fetch session summary" });
  }
});

export default router;

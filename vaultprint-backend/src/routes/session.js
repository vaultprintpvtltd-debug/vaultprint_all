import express from "express";
import crypto from "crypto";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

/* CREATE SESSION */
router.post("/", async (req, res) => {
  try {
    const sessionId = crypto.randomUUID();

    await PrintSession.create({
      sessionId,
      status: "WAITING",
    });

    res.json({ sessionId });
  } catch (err) {
    console.error("❌ Session creation failed:", err);
    res.status(500).json({ error: "Failed to create session", details: err.message });
  }
});

/* SESSION STATUS */
router.get("/:sessionId/status", async (req, res) => {
  const session = await PrintSession.findOne({
    sessionId: req.params.sessionId,
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json({ status: session.status });
});



export default router;

import express from "express";
import { v4 as uuidv4 } from "uuid";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

// CREATE SESSION
router.post("/", async (req, res) => {
  try {
    const session = await PrintSession.create({
      sessionId: uuidv4(),
      status: "CREATED",
    });

    res.json({ sessionId: session.sessionId });
  } catch (err) {
    console.error("Session create error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

export default router;

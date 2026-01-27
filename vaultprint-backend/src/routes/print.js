import express from "express";
import path from "path";
import PrintSession from "../models/PrintSession.js";
import { printDocument } from "../services/printerService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const session = await PrintSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!session.verified) {
      return res.status(403).json({
        success: false,
        message: "OTP not verified",
      });
    }

    if (!session.file) {
      return res.status(404).json({
        success: false,
        message: "No file uploaded for this session",
      });
    }

    if (session.printStatus === "PRINTED") {
      return res.status(409).json({
        success: false,
        message: "Document already printed",
      });
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      session.file.storedName
    );

    // 🖨️ ACTUAL PRINT CALL
    await printDocument(filePath);

    session.printStatus = "PRINTED";
    await session.save();

    res.json({
      success: true,
      message:
        process.env.PRINT_MODE === "SIMULATED"
          ? "Print job completed (simulation)"
          : "Print job sent to printer",
      file: session.file.originalName,
    });
  } catch (err) {
    console.error("❌ Print error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;

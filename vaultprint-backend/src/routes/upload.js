import express from "express";
import multer from "multer";
import PrintSession from "../models/PrintSession.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 SAVE FILE PATH INTO SESSION
    await PrintSession.findOneAndUpdate(
      { sessionId },
      {
        filePath: req.file.path,
      },
      { upsert: true }
    );

    console.log("📁 FILE STORED:", req.file.path);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

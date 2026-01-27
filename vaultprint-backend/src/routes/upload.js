import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

import { calculatePrice } from "../utils/pricing.js";

const router = express.Router();

/* Fix __dirname for ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Multer storage config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* Upload endpoint */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    let pages = 1;

    // Detect file type and convert to PDF if necessary
    if (req.file.mimetype === "application/pdf") {
      const pdfBytes = fs.readFileSync(req.file.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pages = pdfDoc.getPageCount();
    } else if (req.file.mimetype.startsWith("image/")) {
      // Convert Image to PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      const imageBytes = fs.readFileSync(req.file.path);
      let image;

      if (req.file.mimetype === "image/png") {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpg") {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        throw new Error("Unsupported image format. Please upload PDF, PNG, or JPG.");
      }

      // Scale image to fit page
      const imgDims = image.scaleToFit(width - 40, height - 40);

      page.drawImage(image, {
        x: (width - imgDims.width) / 2,
        y: (height - imgDims.height) / 2,
        width: imgDims.width,
        height: imgDims.height,
      });

      // Save the new PDF
      const pdfBytes = await pdfDoc.save();
      const newFilename = req.file.filename + ".pdf";
      const newPath = path.join(__dirname, "../../uploads", newFilename);

      fs.writeFileSync(newPath, pdfBytes);

      // Delete original image to save space (optional, but good practice here)
      try { fs.unlinkSync(req.file.path); } catch (e) { }

      // Update file reference to point to the new PDF
      req.file.path = newPath;
      req.file.filename = newFilename;
      req.file.mimetype = "application/pdf";
      pages = 1;
    }

    const printOptions = {
      pages,
      color: false,
      duplex: false,
      copies: 1
    };

    const price = calculatePrice(printOptions);

    // ⚠️ TEMP RESPONSE (Mongo integration comes later)
    res.json({
      success: true,
      sessionId,
      file: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        pages,
        price,
        options: printOptions
      }
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

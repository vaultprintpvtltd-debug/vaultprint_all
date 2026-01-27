import express from "express";
import fs from "fs";
import { getPayment, markPaid } from "../utils/paymentStore.js";
import { getSession } from "../utils/sessionStore.js";
import printer from "pdf-to-printer";


const router = express.Router();

// 🔴 CHANGE THIS IF YOUR PRINTER NAME IS DIFFERENT
const PRINTER_NAME = "HP LaserJet 1020 Plus";

router.post("/confirm", async (req, res) => {
  const { paymentId } = req.body;

  // 1️⃣ Get payment
  const payment = getPayment(paymentId);
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  if (payment.status === "PAID") {
    return res.status(400).json({ error: "Already paid" });
  }

  if (Date.now() > payment.expiresAt) {
    return res.status(400).json({ error: "Payment expired" });
  }

  // 2️⃣ Mark payment as PAID
  markPaid(paymentId);

  // 3️⃣ Get session
  const session = getSession(payment.sessionId);
  if (!session || !session.files || session.files.length === 0) {
    return res.status(400).json({ error: "No files to print" });
  }

  // 4️⃣ START PRINTING (THIS IS THE KEY CHANGE)
  try {
    for (const filePath of session.files) {
      if (fs.existsSync(filePath)) {
        await printer.print(filePath, { printer: PRINTER_NAME });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: "Printing failed" });
  }

  // 5️⃣ Respond to frontend immediately
  res.json({
    success: true,
    message: "Payment successful. Printing started.",
  });

  // 6️⃣ Cleanup AFTER printing
  setTimeout(() => {
    try {
      for (const filePath of session.files) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      session.status = "COMPLETED";
    } catch (e) {
      console.error("Cleanup failed:", e);
    }
  }, 5000);
});

export default router;

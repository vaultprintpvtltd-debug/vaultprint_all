import { exec } from "child_process";
import fs from "fs";

const PRINTER_NAME = "Canon MG2500 series Printer (Copy 1)";
const POWERSHELL_SCRIPT = "C:\\print-image.ps1";

export async function printDocument(filePath, sessionId) {
  console.log("🖨️ PRINT START");
  console.log("🆔 Session:", sessionId);
  console.log("📄 Image Path:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const cmd = `powershell -ExecutionPolicy Bypass -File "${POWERSHELL_SCRIPT}" -imagePath "${filePath}" -printerName "${PRINTER_NAME}"`;

  console.log("🧾 CMD:", cmd);

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ PRINT FAILED:", stderr || err.message);
        return reject(err);
      }

      console.log("✅ PRINT SUCCESS");
      resolve(true);
    });
  });
}

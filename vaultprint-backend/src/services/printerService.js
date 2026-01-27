import printer from "pdf-to-printer";
import fs from "fs";

const PRINTER_NAME = "Canon MG2500 series Printer (Copy 1)";

export async function printDocument(filePath) {
  console.log("🖨️ PRINT MODE:", process.env.PRINT_MODE);
  console.log("📄 File:", filePath);
  console.log("🖨️ Printer:", PRINTER_NAME);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found: " + filePath);
  }

  if (process.env.PRINT_MODE === "SIMULATED") {
    console.log("🧪 SIMULATED PRINT — no paper will come out");
    return;
  }

  await printer.print(filePath, {
    printer: PRINTER_NAME,
  });

  console.log("✅ Print job sent to Windows spooler");
}

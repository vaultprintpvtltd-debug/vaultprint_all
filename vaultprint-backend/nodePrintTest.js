import printer from "pdf-to-printer";
import path from "path";

const filePath = path.resolve("./uploads/test.pdf");

printer.print(filePath, {
  printer: "Canon MG2500 series Printer"
})
.then(() => console.log("✅ Print command sent"))
.catch(err => console.error("❌ Print failed:", err));

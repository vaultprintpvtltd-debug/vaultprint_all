import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

export async function imageToPdf(imagePath) {
  const imageBytes = fs.readFileSync(imagePath);
  const pdfDoc = await PDFDocument.create();

  let image;
  if (imagePath.endsWith(".png")) {
    image = await pdfDoc.embedPng(imageBytes);
  } else {
    image = await pdfDoc.embedJpg(imageBytes);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();

  const pdfPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, ".pdf");
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
}

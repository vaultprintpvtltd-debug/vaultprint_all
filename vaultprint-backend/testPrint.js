import printer from "pdf-to-printer";

await printer.print("./uploads/test.pdf", {
  printer: "Canon MG2500 series Printer (Copy 1)",
});

console.log("DONE");

import crypto from "crypto";

export function createPrintJob(sessionId, files) {
  const job = {
    jobId: crypto.randomUUID(),
    sessionId,
    totalFiles: files.length,
    status: "PRINT_READY",
    createdAt: new Date().toISOString()
  };

  console.log("🖨️ PRINT JOB READY (PRINTER NOT CONNECTED)");
  console.log(job);

  return job;
}

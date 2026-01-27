import crypto from "crypto";

const payments = new Map();

export function createPayment(sessionId, amount) {
  const paymentId = crypto.randomUUID();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  const payment = {
    paymentId,
    sessionId,
    amount,
    status: "PENDING",
    expiresAt
  };

  payments.set(paymentId, payment);
  return payment;
}

export function getPayment(paymentId) {
  return payments.get(paymentId);
}

export function markPaid(paymentId) {
  const payment = payments.get(paymentId);
  if (!payment) return;
  payment.status = "PAID";
}

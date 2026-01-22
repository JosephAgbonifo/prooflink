import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    paymentId: { type: String, required: true },
    receiptId: { type: String, required: true },
    payerWallet: { type: String, required: true },
    currency: { type: String, required: true },
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    proofHash: { type: String }, // could store transaction hash or generated proof ID
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

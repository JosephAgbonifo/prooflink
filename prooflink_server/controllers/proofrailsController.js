import { v4 as uuidv4 } from "uuid";
import { postRequest } from "../services/api.js";
import Payment from "../models/payment.js"; // Adjust this path to your model file
import Project from "../models/projects.js";

export const addPayment = async (req, res) => {
  const data = req.body;
  const reference = uuidv4();

  try {
    // 1. External API Call (ProofRail)
    const tip = {
      tip_tx_hash: data.paymentId,
      chain: "coston2",
      amount: data.amount,
      currency: "FLR",
      sender_wallet: data.payerWallet || "unknown",
      receiver_wallet: "platform",
      reference: reference,
      callback_url: "string",
    };

    const response = await postRequest("/v1/iso/record-tip", tip);

    // 2. Save the individual Payment record
    const newPayment = new Payment({
      projectId: data.projectId,
      paymentId: data.paymentId,
      receiptId: response.receipt_id,
      payerWallet: data.payerWallet,
      amount: Number(data.amount),
      asset: data.asset || "FLR",
      proofHash: data.paymentId,
      reference: reference,
    });

    await newPayment.save();

    // 3. UPDATE PROJECT BALANCE
    // Use $inc to add the amount to the existing totalBalance field
    const updatedProject = await Project.findOneAndUpdate(
      { projectId: data.projectId },
      { $inc: { totalBalance: Number(data.amount) } },
      { new: true } // returns the updated document
    );

    if (!updatedProject) {
      console.error(`Project ${data.projectId} not found to update balance`);
      // Optional: You might want to handle this edge case
    }

    // 4. Return success with both records
    return res.status(201).json({
      message: "Payment recorded and project balance updated",
      payment: newPayment,
      newTotalBalance: updatedProject?.totalBalance || 0,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    if (error.response?.status === 401) {
      return res
        .status(401)
        .json({ error: "Backend API Authentication failed" });
    }
    res.status(500).json({ error: "Failed to add payment" });
  }
};

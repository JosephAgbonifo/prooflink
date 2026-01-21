import Payment from "../models/payment.js";
import Project from "../models/projects.js";

export const checkPaymentStatus = async (req, res) => {
  try {
    const { projectId, walletAddress } = req.query;

    // 1. Validation
    if (!projectId || !walletAddress) {
      return res.status(400).json({
        error: "Missing required query parameters: projectId and walletAddress",
      });
    }

    // 2. Verify Project Exists (Optional but recommended for data integrity)
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 3. Check for existing payment
    const payment = await Payment.findOne({
      projectId: projectId,
      payerWallet: walletAddress, // Normalize to lowercase
    }).select("-__v -updatedAt"); // Exclude internal mongoose fields

    // 4. Construct Response
    if (payment) {
      return res.status(200).json({
        hasPaid: true,
        payment: {
          projectId: payment.projectId,
          paymentId: payment.paymentId,
          receiptId: payment.receiptId,
          payerWallet: payment.payerWallet,
          reference: payment.reference,
          amount: payment.amount,
          asset: payment.asset,
          proofHash: payment.proofHash,
          timestamp: payment.timestamp,
        },
      });
    } else {
      // Return false if no payment record is found
      return res.status(200).json({
        hasPaid: false,
        payment: null,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

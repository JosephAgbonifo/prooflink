import Payment from "../models/payment.js"; // Adjust path as needed
import Project from "../models/projects.js";
import { getRequest } from "../services/api.js";

export const getPayments = async (req, res) => {
  try {
    const { walletaddress } = req.query;

    // Create a dynamic query object
    const query = {};
    if (walletaddress) {
      // Matches the 'payerWallet' field in your schema
      query.payerWallet = walletaddress;
    }

    const payments = await Payment.find(query)
      .sort({ timestamp: -1 }) // Show most recent payments first
      .select("-__v"); // Clean up the response

    return res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({ error: "Failed to retrieve payments" });
  }
};

export const getPaymentByReceipt = async (req, res) => {
  try {
    // 1. Get the receiptId from the URL (req.params)
    const { receiptId } = req.params;

    // 2. Search for the specific document in MongoDB
    const payment = await Payment.findOne({ receiptId }).select("-__v"); // Exclude version key

    // 3. Handle "Not Found" case
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment record found with that receipt ID.",
      });
    }

    const proof = await getRequest("/v1/iso/receipts/" + receiptId);

    const details = {
      payment,
      proof,
    };

    // 4. Return the payment data
    return res.status(200).json(details);
  } catch (err) {
    console.error("Error fetching payment by receipt:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching receipt details.",
    });
  }
};

/**
 * Get the fundraising progress for a specific project
 * Returns: { goal, current, percent_completion, currency }
 */
export const getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Fetch the project
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 2. Aggregate payments: Calculate Total Raised AND Unique Payee Count
    const paymentData = await Payment.aggregate([
      { $match: { projectId: projectId } },
      {
        $group: {
          _id: "$projectId",
          totalRaised: { $sum: "$amount" },
          // Collect unique sender addresses/IDs into a set
          uniquePayees: { $addToSet: "$payerWallet" },
        },
      },
      {
        $project: {
          totalRaised: 1,
          payeeCount: { $size: "$uniquePayees" }, // Count the unique items
        },
      },
    ]);

    const goal = project.fundraisingGoal || 0;
    const current = paymentData.length > 0 ? paymentData[0].totalRaised : 0;
    const payeeCount = paymentData.length > 0 ? paymentData[0].payeeCount : 0;
    const oneTimeBal = project.balance;

    let balance = 0;

    if (project.paymentType === "onetime") {
      // For one-time payments, the 'balance' is the cumulative total collected
      balance = oneTimeBal;
    } else {
      // For goal-based projects, 'balance' is the gap remaining
      // We use Math.max(0, ...) to ensure we don't show a negative balance if overfunded
      const remaining = goal - current;
      balance = Number(Math.max(0, remaining).toFixed(2));
    }
    console.log(
      "payeeCount:",
      payeeCount,
      "current:",
      current,
      "goal:",
      goal,
      "balance:",
      balance
    );
    // 3. Conditional Return based on Project Type
    if (project.paymentType === "onetime") {
      return res.status(200).json({
        balance,
        payeeCount,
        current,
      });
    }

    // Default Full Response (for non-onetime projects)
    const percent_completion =
      goal > 0 ? parseFloat(((current / goal) * 100).toFixed(2)) : 0;

    console.log("data:", {
      projectId,
      title: project.title,
      goal,
      current,
      percent_completion: `${percent_completion}%`,
      balance,
      payeeCount,
      raw_percent: percent_completion,
      currency: "FLR",
    });

    return res.status(200).json({
      projectId,
      title: project.title,
      goal,
      current,
      percent_completion: `${percent_completion}%`,
      balance,
      payeeCount,
      raw_percent: percent_completion,
      currency: "FLR",
    });
  } catch (err) {
    console.error("Error calculating project progress:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all payment records for a specific project
 * Endpoint: GET /payments/:projectId
 */
export const getPaymentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    // 1. Fetch all payments matching this projectId
    const payments = await Payment.find({ projectId })
      .sort({ createdAt: -1 }) // Most recent first
      .select("-__v"); // Clean response

    // 2. Return the list (returns empty array if no payments found)
    return res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching project payments:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching project payments.",
    });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { projectId, walletAddress } = req.body;

    // 1. Validation
    if (!projectId || !walletAddress) {
      return res.status(400).json({
        error: "Missing projectId or walletAddress",
      });
    }

    const cleanWallet = walletAddress.trim();
    const cleanProject = projectId.trim();

    // 2. Count documents matching both criteria
    // Use senderAddress (or your specific schema field name)
    const paymentCount = await Payment.countDocuments({
      projectId: cleanProject,
      payerWallet: cleanWallet, // Ensure case-consistency
    });

    // 3. Return results
    return res.status(200).json({
      hasPaid: paymentCount > 0,
      paymentCount: Number(paymentCount),
      projectId,
      walletAddress,
    });
  } catch (err) {
    console.error("Error checking payment status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

import Project from "../models/projects.js";
import Payment from "../models/payment.js";
import { v4 as uuidv4 } from "uuid";
import { vaultContract } from "../services/contract.js";

/**
 * Create a new project
 * Expects JSON body with: title, description, creatorWallet, paymentType,
 * minimumPayment (optional), fixedAmount (optional), fundraisingGoal (optional)
 */
export const createProject = async (req, res) => {
  let nhash = "";
  try {
    const {
      title,
      description,
      creatorWallet,
      imageUrl,
      paymentType,
      minimumPayment,
      fixedAmount,
      fundraisingGoal,
    } = req.body;

    if (!title || !description || !creatorWallet || !paymentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Generate unique projectId
    const projectId = uuidv4();

    // 3. ANCHOR TO SMART CONTRACT FIRST
    console.log(`🔗 Anchoring project ${projectId} to Flare...`);
    try {
      const tx = await vaultContract.registerProject(projectId);
      await tx.wait(); // Wait for block confirmation
      console.log("✅ On-chain registration successful:", tx.hash);
      nhash = tx.hash;
    } catch (contractErr) {
      console.error("❌ Smart Contract Reverted:", contractErr);
      return res.status(502).json({
        error: "Blockchain anchor failed. Project not created.",
        details: contractErr.message,
      });
    }

    // 4. SAVE TO DATABASE ONLY IF CONTRACT SUCCEEDED
    const newProject = new Project({
      projectCreationHash: nhash,
      projectId,
      title,
      ImageUrl: imageUrl,
      description,
      creatorWallet,
      paymentType,
      minimumPayment:
        paymentType === "fundraising" ? minimumPayment : undefined,
      fixedAmount: paymentType === "onetime" ? fixedAmount : undefined,
      fundraisingGoal:
        paymentType === "fundraising" ? fundraisingGoal : undefined,
    });

    await newProject.save();

    return res.status(201).json({
      success: true,
      project: newProject,
      txHash: nhash, // Useful for the frontend to show proof
    });
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    // 1. Extract the walletaddress from query params (e.g., /projects?walletaddress=0x...)
    const { walletaddress } = req.query;

    // 2. Build a dynamic filter object
    const filter = {};
    if (walletaddress) {
      filter.creatorWallet = walletaddress;
    }

    // 3. Pass the filter to the find method
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .select("-_id -__v");

    return res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const project = await Project.findOne({ projectId }).select("-_id -__v");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    // 1. Check if the project exists
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // 2. Check for ANY contributions in the Payment collection
    const paymentCount = await Payment.countDocuments({ projectId });

    if (paymentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `This project cannot be deleted because it has received ${paymentCount} contribution(s).`,
      });
    }

    // 3. OPTIONAL: Call a simple "Remove" on Smart Contract (if no money is involved)
    // If you want to keep the DB and Chain in sync even for empty projects:
    /*
    try {
      const tx = await vaultContract.removeProject(projectId); // A simple delete function
      await tx.wait();
    } catch (contractErr) {
      console.error("Contract removal failed:", contractErr);
      // We continue anyway or return error based on your preference
    }
    */

    // 4. Delete from Database
    await Project.findOneAndDelete({ projectId });

    return res.status(200).json({
      success: true,
      message: "Project successfully deleted since no contributions were made.",
    });
  } catch (error) {
    console.error("Delete Controller Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const setWithdrawalStatusDB = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Validation
    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      {
        projectId: projectId,
        paymentType: { $ne: "onetime" }, // "Not Equal" to onetime
      },
      { $set: { withdrawalStatus: true } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found in database" });
    }

    return res.status(200).json({
      success: true,
      message: "Database updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Server error updating database" });
  }
};

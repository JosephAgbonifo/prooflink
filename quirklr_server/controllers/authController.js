import User from "../models/auth.js";
import { generateApiKey } from "../utils/keygen.js";

export const checkApiKey = async (req, res) => {
  try {
    const { wallet } = req.query;

    // 1. Validation: Ensure a wallet address was provided
    if (!wallet) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // 2. Query: Find the user with this wallet address
    // We only select 'apiKey' to keep the response lean
    const user = await User.findOne({ userWallet: wallet }).select("apiKey");

    // 3. Response: Check if user exists
    if (!user) {
      return res.status(404).json({ error: "No user found with this wallet" });
    }

    // 4. Return the API key
    return res.status(200).json({
      success: true,
      apiKey: user.apiKey,
    });
  } catch (error) {
    console.error("Error checking API key:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const registerOrCheckWallet = async (req, res) => {
  try {
    // Handling both query (?wallet=) and params (/:wallet) for safety
    const wallet = req.params.wallet || req.query.wallet;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // 1. Generate a brand new set of keys
    const key = generateApiKey();
    const rawKey = key.rawKey;
    const hashedKey = key.hashedKey;

    // 2. Find and Update (or Create if doesn't exist)
    // This effectively "deletes" the old key by overwriting it with the new hash
    const user = await User.findOneAndUpdate(
      { userWallet: wallet },
      { apiKey: hashedKey },
      {
        new: true, // Return the updated document
        upsert: true, // Create it if it doesn't exist
        setDefaultsOnInsert: true,
      }
    );

    // 3. Return the RAW key to the user (the only time they will see it)
    return res.status(200).json({
      success: true,
      message: "API Key generated successfully. Save it securely!",
      apiKey: rawKey,
    });
  } catch (error) {
    console.error("Error in registerOrCheckWallet:", error);
    res.status(500).json({ error: "Server error" });
  }
};

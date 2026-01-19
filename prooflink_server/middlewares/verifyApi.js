import User from "../models/auth.js";
import { hashKey } from "../utils/keygen.js";

export const validateApiKey = async (req, res, next) => {
  try {
    const rawKey = req.header("X-API-KEY");

    // 1. Check if the header exists
    if (!rawKey) {
      return res.status(401).json({
        error: "Unauthorized: No API key provided.",
      });
    }

    // 2. Hash the incoming raw key to match the database format
    const hashedIncomingKey = hashKey(rawKey);

    // 3. Find user with this hashed key
    const user = await User.findOne({ apiKey: hashedIncomingKey });

    if (!user) {
      return res.status(403).json({
        error: "Forbidden: Invalid API key.",
      });
    }

    // 4. Attach user info to the request object for use in next routes
    req.user = user;

    // 5. Continue to the actual controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during authentication." });
  }
};

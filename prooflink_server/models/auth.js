import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userWallet: { type: String, unique: true, sparse: true },
    apiKey: { type: String, unique: true },
  },
  { timestamps: true }
);

// This prevent recompilation errors during Next.js hot reloads
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

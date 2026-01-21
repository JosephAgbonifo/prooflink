import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true }, // backend-generated
    title: { type: String, required: true },
    balance: { type: String, default: "0" },
    description: { type: String, required: true },
    currency: { type: String, required: true },
    ImageUrl: { type: String },
    creatorWallet: { type: String, required: true }, // wallet address from frontend
    projectCreationHash: { type: String, required: true }, // tx hash of creation on-chain
    paymentType: {
      type: String,
      enum: ["fundraising", "onetime"],
      required: true,
    },
    withdrawalStatus: { type: Boolean, default: false },
    minimumPayment: { type: Number }, // only for fundraising
    fixedAmount: { type: Number }, // only for onetime
    fundraisingGoal: { type: Number }, // only for fundraising
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

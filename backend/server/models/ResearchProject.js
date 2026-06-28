import mongoose from "mongoose";

const researchProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    principalInvestigator: { type: String, trim: true },
    department: { type: String, trim: true },
    grantAmount: { type: Number, default: 0 },
    fundingAgency: { type: String, trim: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold", "Cancelled"],
      default: "Active",
    },
    description: { type: String, trim: true },
    facultyMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("ResearchProject", researchProjectSchema);

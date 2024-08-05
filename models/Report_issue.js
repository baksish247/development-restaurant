import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    restaurant_id: { type: String, required: true },
    ticketNumber: { type: String, required: true },
    issueDescription: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Report_issue || mongoose.model("Report_issue", ReportSchema);

import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: String,
      required: true,
    },
    employees: {
      type: [],
    },
    review: {
      type: String,
    },
    paymentId: {
      type: String,
      default: "",
    },
    amount: {
      type: String,
      required: true,
    },
    paymentstatus: {
      type: String,
      default: "Initiated",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

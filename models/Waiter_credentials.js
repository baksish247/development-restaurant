import mongoose from "mongoose";
const waiterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    ispresent:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Waiter_credentials =
  mongoose.models.Waiter_credentials ||
  mongoose.model("Waiter_credentials", waiterSchema);
export default Waiter_credentials;

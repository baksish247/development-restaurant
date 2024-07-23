import mongoose from "mongoose";

const Restaurant_credentialsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    restaurantid: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Restaurant_credentials = mongoose.models.Restaurant_credentials || mongoose.model('Restaurant_credentials', Restaurant_credentialsSchema);
export default Restaurant_credentials;

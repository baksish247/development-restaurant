import mongoose from "mongoose";

const connDB = (handler) => (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  } else {
    mongoose.connect(process.env.MONGODB_URI);
    return handler(req, res);
  }
};
export default connDB;

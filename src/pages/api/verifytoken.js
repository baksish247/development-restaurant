// pages/api/auth/verify-token.js

import connDB from "../../../middleware/connDB";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { token } = req.body;
  //console.log(token);

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ success: true, decoded });
  } catch (error) {
    //console.error("Token verification failed:", error);
    return res.status(201).json({ success: false, message: "Invalid token" });
  }
};

export default connDB(handler);

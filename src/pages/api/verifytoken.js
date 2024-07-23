// pages/api/verifytoken.js
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return res.status(200).json({ success: true, decoded });
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(201).json({ success: false, message: "Invalid token" });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

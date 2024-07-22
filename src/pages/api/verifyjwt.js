// pages/api/verifyToken.js

import connDB from "../../../middleware/connDB";
import jwt from "jsonwebtoken";
import Restaurant_credentials from "../../../model/Restaurant_credentials";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await Restaurant_credentials.findOne({ name: decoded.name });

      if (user) {
        return res
          .status(200)
          .json({ success: true, restaurantid: user.restaurantid });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);

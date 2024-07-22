import connDB from "../../../middleware/connDB";
import Restaurant_credentials from "../../../model/Restaurant_credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Identifier and password are required" });
  }

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const query = isEmail ? { email: email } : { phoneNo: email };

    const user = await Restaurant_credentials.findOne(query);

    if (!user) {
      return res
        .status(203)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(203)
        .json({ success: false, message: "Invalid password" });
    }

    // Calculate the expiration time for the token to expire at 4 AM the next day
    const now = new Date();
    let expiration = new Date();
    expiration.setHours(4, 0, 0, 0); // Set to 4 AM of the current day

    // If the current time is past 4 AM, set the expiration to 4 AM the next day
    if (now > expiration) {
      expiration.setDate(expiration.getDate() + 1);
    }

    const expiresInSeconds = Math.floor((expiration.getTime() - now.getTime()) / 1000);

    const token = jwt.sign(
      { name: user.name, restaurantid: user.restaurantid },
      process.env.JWT_SECRET_KEY,
      { expiresIn: expiresInSeconds } // Set token expiration time
    );

    return res
      .status(200)
      .json({ success: true, token, restaurantid: user.restaurantid });
  } catch (error) {
    console.error("Error during authentication:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default connDB(handler);

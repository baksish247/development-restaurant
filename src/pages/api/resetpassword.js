import connDB from "../../../middleware/connDB";
import Restaurant_credentials from "../../../models/Restaurant_credentials";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  try {
    if (req.method == "POST") {
      const { name, resid, password, newpassword } = req.body;
      const user = await Restaurant_credentials.findOne({
        name: name,
        restaurantid: resid,
      });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const hashedPassword = await bcrypt.hash(newpassword, 10);
          const u = await Restaurant_credentials.findOneAndUpdate(
            { name: name, restaurantid: resid },
            { password: hashedPassword }
          );
          if (u) {
            return res.status(200).json({
              success: true,
              message: "Password changed successfully",
            });
          } else {
            return res.status(201).json({
              success: false,
              error: "Error in changing password",
            });
          }
        }
      } else {
        return res.status(201).json({
          success: false,
          error: "Incorrect password",
        });
      }
    } else {
      return res.status(201).json({
        success: false,
        error: "Method not allowed",
      });
    }
  } catch (e) {
    return res.status(202).json({
      success: false,
      error: "An error occurred",
    });
  }
};

export default connDB(handler);

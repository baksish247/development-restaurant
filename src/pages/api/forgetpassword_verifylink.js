import connDB from "../../../middleware/connDB";
import Restaurant_credentials from "../../../models/Restaurant_credentials";
var jwt = require("jsonwebtoken");
import bcrypt from "bcrypt"

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      const token = req.body.token;
      const newpassword = req.body.password;
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const diff = parseInt(Date.now()) - decode.time;
      if (decode && diff <= 900000) {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const u = await Restaurant_credentials.findOneAndUpdate(
          { email: decode.email },
          { password: hashedPassword }
        );
        if (u) {
          res.status(200).json({ success: true });
        } else {
          res.status(201).json({ success: false, error: "user not found" });
        }
      } else {
        res.status(201).json({ success: false, error: "link expired" });
      }
    } catch (e) {
      res.status(201).json({ success: false, data: "error occured" });
    }
  } else {
    res.status(201).send({ success: false, error: "error method" });
  }
};
export default connDB(handler);

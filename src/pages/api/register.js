import connDB from "../../.././middleware/connDB";
import Restaurant_credentials from "../../../model/Restaurant_credentials";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  try {
    if (req.method == "POST") {
      const { username, password, email, name, phoneNo, restaurantid } =
        req.body;

      //console.log(req.body);
      const passwordhashed = await bcrypt.hash(password, 10);
      const u = new Restaurant_credentials({
        username,
        password: passwordhashed,
        email,
        phoneNo,
        name,
        restaurantid,
      });
      const u1 = await u.save();
      res.status(201).json({ success: true, data: u1 });
    } else {
      res.status(501).json({ success: false, data: "no data" });
    }
  } catch (error) {
    res.status(501).json({ success: false, data: "no data" });
  }
};

export default connDB(handler);

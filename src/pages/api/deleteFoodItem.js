// pages/api/deleteFoodItem.js
import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { id } = req.body;
    console.log(id);

    try {
      await FoodItems.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Food item deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
};
export default connDB(handler);

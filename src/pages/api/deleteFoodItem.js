// pages/api/deleteFoodItem.js
import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";
import RestaurantItems from "../../../models/RestaurantItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { id } = req.body;
    console.log(id);

    try {
      // Delete the food item from FoodItems
      const deletedFoodItem = await FoodItems.findByIdAndDelete(id);

      if (!deletedFoodItem) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }

      // Remove the reference from RestaurantItems
      await RestaurantItems.updateMany(
        { food_items: id },
        { $pull: { food_items: id } }
      );

      res.status(200).json({ success: true, message: "Food item deleted and reference removed" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default connDB(handler);

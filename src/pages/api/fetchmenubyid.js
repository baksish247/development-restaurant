import connDB from "../../../middleware/connDB";
import { FoodItems } from "../../../model/FoodItems";
import RestaurantItems from "../../../model/RestaurantItems";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      const { restaurant_id } = req.body;
      //console.log(restaurant_id);
      const menu = await RestaurantItems.findOne({ restaurant_id }).populate(
        "food_items"
      );
      //console.log(menu);
      if (menu) {
        res.status(200).json({ success: true, data: menu });
      } else {
        res
          .status(201)
          .json({ success: false, error: "No menu found for this restaurant" });
      }
    } catch (e) {
      res
        .status(201)
        .json({
          success: false,
          error:
            "We are facing some technical issue currently, you can however order in-person directly to the waiter",
        });
    }
  }
};
export default connDB(handler);

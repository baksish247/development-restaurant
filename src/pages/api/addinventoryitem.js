// pages/api/addInventoryAndRestaurantItem.js
import connDB from "../../../middleware/connDB";
import InventoryItems from "../../../models/InventoryItems";
import RestaurantInventory from "../../../models/RestaurantInventory";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const {
        restaurant_id,
        item_name,
        item_code,
        item_group,
        item_photo,
        on_hand_amount,
        last_purchase_date,
        last_purchase_amount,
        purchase_history,
        type,
      } = req.body;

      // Create and save new inventory item
      const newItem = new InventoryItems({
        restaurant_id,
        item_name,
        item_code,
        item_group,
        item_photo,
        on_hand_amount,
        last_purchase_date,
        last_purchase_amount,
        purchase_history,
        type,
      });

      await newItem.save();

      const restaurantInventory = await RestaurantInventory.findOne({ restaurant_id });
      if (!restaurantInventory) {
        const newRestaurantInventory = new RestaurantInventory({
          restaurant_id,
          items: [newItem._id],
        });
        const u=await newRestaurantInventory.save();
        res.status(200).json({ success: true, data: u });
      } else {
        restaurantInventory.items.push(newItem._id);
        const u=await restaurantInventory.save();
        res.status(200).json({ success: true, data: u });
      }
    } else {
      res.status(201).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(201).json({ success: false, error: "Error occurred while adding item to inventory and restaurant inventory" });
  }
};

export default connDB(handler);

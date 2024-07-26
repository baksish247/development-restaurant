// pages/api/updateInventoryItems.js
import connDB from "../../../middleware/connDB";
import InventoryItems from "../../../models/InventoryItems";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { items } = req.body; // items should be an array of objects { item_id, new_amount }

      // Validate the input
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid input data" });
      }

      const updatePromises = items.map(async ({ item_id, new_amount }) => {
        const item = await InventoryItems.findById(item_id);

        if (!item) {
          throw new Error(`Item with id ${item_id} not found`);
        }

        const updatedAmount = parseFloat(item.on_hand_amount) - parseFloat(new_amount);
        item.on_hand_amount = updatedAmount.toString();

        return item.save();
      });

      const updatedItems = await Promise.all(updatePromises);

      res.status(200).json({ success: true, data: updatedItems });
    } else {
      res.status(201).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(201).json({ success: false, error: "Error occurred while updating items" });
  }
};

export default connDB(handler);

import connDB from "../../../middleware/connDB";
import OrderFoodItems from "../../../models/OrderFoodItems";
import mongoose from "mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") { 
    //console.log("delete",req.body);// Ensure DELETE method is used for deletion
    const { deleteitems } = req.body;

    if (!Array.isArray(deleteitems) || deleteitems.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    try {
      const deletedItems = [];
      for (let itemId of deleteitems) {
        const objectId = new mongoose.Types.ObjectId(itemId);
        // Validate if itemId is a valid ObjectId string
        if (!mongoose.Types.ObjectId.isValid(objectId)) {
          //console.log(`Invalid ObjectId: ${objectId}`);
          continue; // Skip this item and move to the next
        }   

        const deletedItem = await OrderFoodItems.findByIdAndDelete(objectId);
        if (deletedItem) {
          deletedItems.push(deletedItem);
        } else {
          //console.log(`Item with ID ${itemId} not found.`);
        }
      }

      if (deletedItems.length > 0) {
        res.status(200).json({ success: true, message: "Items deleted", deletedItems });
      } else {
        res.status(404).json({ success: false, message: "No items deleted" });
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      res.status(500).json({ success: false, message: "Failed to delete items", error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default connDB(handler);

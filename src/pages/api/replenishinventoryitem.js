// pages/api/updateInventoryItems.js
import connDB from "../../../middleware/connDB";
import InventoryItems from "../../../models/InventoryItems";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { item_id, amount } = req.body; // items should be an array of objects { item_id, new_amount }

      const date = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options);
      console.log(formattedDate);

      const item = await InventoryItems.findById(item_id);
      if (!item) {
        throw new Error(`Item with id ${item_id} not found`);
      }
      const updatedAmount =
        parseFloat(item.on_hand_amount) + parseFloat(amount);
      item.last_purchase_date = formattedDate;
      item.last_purchase_amount = amount;
      const details={
        purchasedate: formattedDate,
        purchase_amount:amount,
        amountbeforepurchase: item.on_hand_amount
      }
      item.purchase_history.push(details);
      item.on_hand_amount = updatedAmount.toString();
      const u=await item.save();
      if(u){
      res.status(200).json({ success: true, data: u });
      }
      else{
        res.status(201).json({ success: false, message: "Failed to update item" });
      }
    } else {
      res.status(201).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res
      .status(201)
      .json({ success: false, error: "Error occurred while updating items" });
  }
};

export default connDB(handler);

import connDB from "../../../middleware/connDB";
import OrderFoodItems from "../../../models/OrderFoodItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { updatedQty } = req.body;
    //console.log(updatedQty);

    try {
      for (const id in updatedQty) {
     //   console.log(id);
        const newQuantity = updatedQty[id];
        await OrderFoodItems.findByIdAndUpdate(
          id,
          { quantity: newQuantity.toString() },
          { new: true }
        );
      }

      res
        .status(200)
        .json({ success: true, message: "Quantities updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update quantities" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
export default connDB(handler);

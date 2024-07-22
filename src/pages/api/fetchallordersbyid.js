import connDB from "../../../middleware/connDB";
import Orders from "../../../model/Orders";
import { FoodItems } from "../../../model/FoodItems";
import SingleOrders from "../../../model/SingleOrders";
import OrderFoodItems from "../../../model/OrderFoodItems";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { restaurant_id } = req.body;
      //console.log(restaurant_id)
      const orders = await Orders.find({restaurant_id})
        .populate({
          path: 'order_items',
          populate: {
            path: 'items',
            populate: {
              path: 'food',
              model: 'FoodItems'
            }
          }
        });
        
        if(orders.length > 0) {
      res.status(200).json({ success: true, data: orders });
        } else {
        res.status(404).json({ success: false, data: "No orders found" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default connDB(handler);
import connDB from "../../../middleware/connDB";
import Orders from "../../../models/Orders";
import { FoodItems } from "../../../models/FoodItems";
import SingleOrders from "../../../models/SingleOrders";
import OrderFoodItems from "../../../models/OrderFoodItems";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { restaurant_id } = req.body;
      //console.log(restaurant_id);
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
        }).sort({ createdAt: -1 });;
        if(orders.length > 0) {
      res.status(200).json({ success: true, data: orders });
        } else {
        res.status(201).json({ success: true,data:[], error: "No orders found" });
      }
    }
  } catch (error) {
    res.status(202).json({ success:false,error: error.message });
  }
};

export default connDB(handler);
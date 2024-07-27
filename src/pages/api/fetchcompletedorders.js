import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";
import FoodItems from "../../../models/FoodItems";


const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { restaurant_id } = req.body;
      //console.log(restaurant_id)
      const orders = await CompletedOrders.find({restaurant_id,order_status:"paid"})
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
        res.status(201).json({ success: false, data:[],error: "No orders found" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default connDB(handler);
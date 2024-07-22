import connDB from "../../../middleware/connDB";
import Transaction from "../../../model/Transaction";
const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { restaurant_id } = req.body;
      //console.log(restaurant_id);

      // Fetch all orders for the given restaurant_id
      const orders = await Transaction.find({ restaurant_id ,paymentstatus:"success"});
      //console.log(orders)
      if (orders.length >0 ) {
        // Calculate the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
  
        // Calculate the total sum for today's orders
        let tsum = 0;
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].createdAt >= startOfDay && orders[i].createdAt <= endOfDay) {
            tsum += parseFloat(orders[i].amount);
          }
        }

        res.status(200).json({ success: true, total: tsum.toFixed(2), data: orders });
      } else {
        res.status(202).json({ success: false, data: "No orders found" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default connDB(handler);

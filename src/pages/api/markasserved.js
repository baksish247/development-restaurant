import connDB from "../../../middleware/connDB";
import Orders from "../../../models/Orders";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
        //console.log(req.body);
      const {order_id} = req.body;
      console.log(req.body);
      const order = await Orders.findOneAndUpdate({order_id:order_id}, {
        order_status: "served",
        served_at: new Date(),
      });
      console.log(order)
      if (!order) {
        return res.status(200).json({success:false, message: "Order not found" });
      }else{
        return res.status(200).json({success:true,message: "Order updated"})
      }
    } catch (error) {
      // console.log(error);
      res.status(201).json({ success:false,message: "Internal Server Error" });
    }
  } else {
    res.status(201).json({ success:false,message: "Method Not Allowed" });
  }
};

export default connDB(handler);

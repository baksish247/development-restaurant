import connDB from "../../../middleware/connDB";
import Orders from "../../../model/Orders";
import SingleOrders from "../../../model/SingleOrders";


const handler = async (req, res) => {
  if (req.method === "POST") {
   // console.log(req.body);
    try {
      const { orderId ,cgst,sgst} = req.body;
      
      const orders = await Orders.find({ order_id: orderId }).populate({
        path: "order_items",
        populate: {
          path: "items",
          populate: {
            path: "food",
            model: "FoodItems",
          },
        },
      });
      let newupdatedSingleOrder;
      if (orders.length > 0) {
        const o = orders[0].order_items;
        //console.log(orders[0])
        const calculatedtaxrate=(0.01*(parseFloat(cgst)+parseFloat(sgst))).toFixed(2);
        let totquantity = 0;
        let price = 0;
        for (let i = 0; i < o.length; i++) {
          const item = o[i];
          let itotal=0,fprice=0,charges=0;
          //console.log(item)
          for (let j = 0; j < item.items.length; j++) {
            itotal +=parseFloat(item.items[j]?.quantity) *
            parseFloat(item.items[j]?.food.price);

            // console.log(item.items.length)
            totquantity += parseFloat(item.items[j]?.quantity);
            price +=
              parseFloat(item.items[j]?.quantity) *
              parseFloat(item.items[j]?.food.price);
          }
          charges=(parseFloat(itotal) * parseFloat(calculatedtaxrate)).toFixed(2);
          fprice=(parseFloat(itotal) + parseFloat(charges)).toFixed(2);
          newupdatedSingleOrder = await SingleOrders.findByIdAndUpdate(item._id,{item_total:itotal,charges:charges,total_price:fprice});
          //console.log(i)
        }
      //  console.log(totquantity, price);
        
        const tax = (parseFloat(price) * parseFloat(calculatedtaxrate)).toFixed(2);
        const total_bill = (parseFloat(price) + parseFloat(tax)).toFixed(2);
        const newupdatedpriceorder= await Orders.findOneAndUpdate({order_id:orderId},{initial_bill:price,tax:tax,total_bill:total_bill,total_quantity:totquantity,order_status:"updated"});
        if(newupdatedpriceorder){
        
          res.status(200).json({ success: true, data: newupdatedpriceorder });
        }
        else{
          res.status(201).json({ success: false, message: "Error in updating bill" });
        }
      } else {
        res.status(201).json({ success: false, message: "No order found" });
      }
    } catch (e) {
      console.error(e);
      res.status(201).json({
        success: false,
        error:
          "We are facing some technical issue currently, you can however order in-person directly to the waiter",
      });
    }
  } else {
    res.status(201).json({
      success: false,
      error: "Method not allowed. Please use POST method.",
    });
  }
};

export default connDB(handler);

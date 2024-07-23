import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";
import Orders from "../../../models/Orders";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      //console.log(req.body)
      const {
        order_id,
        cgst,
        sgst,
        discountamount,
        discountpercent,
        discountdescription,
        total_amount,
      } = req.body;
      const order = await Orders.findOne({ order_id });
      let billno;
      if (order) {
        const existingbill = await CompletedOrders.findOne({
          order_id: order_id,
        });
        if (existingbill) {
          const u = await CompletedOrders.findOneAndUpdate(
            { order_id: order_id },
            {
              order_items: order.order_items,
              total_quantity: order.total_quantity,
              initial_bill: order.initial_bill,
              cgstamount: cgst,
              sgstamount: sgst,
              tax: (parseFloat(cgst)+parseFloat(sgst)).toFixed(2),
              discountpercent: discountpercent,
              discountamount: discountamount,
              discount_description: discountdescription,
              total_bill: total_amount,
              order_status: "billgenerated",
            },{new:true}
          );
          if(u){
            const a = await Orders.findOneAndUpdate(
                { order_id },
                {
                  tax: (parseFloat(cgst) + parseFloat(sgst)).toFixed(2),
                  total_bill: total_amount,
                  order_status: "billgenerated",
                }
              );
              if (a) {
                res.status(200).json({ success: true, data: u });
              } else {
                res
                  .status(401)
                  .json({ success: false, error: "Couldn't update order store" });
              }
        }
        } else {
          const lastUpdatedDocument = await CompletedOrders.findOne()
            .sort({ updatedAt: -1 })
            .exec();
          //console.log(lastUpdatedDocument);
          if (lastUpdatedDocument) {
            billno = parseInt(lastUpdatedDocument.bill_no) + 1;
          } else {
            billno = 1;
          }
          //console.log(order.initial_bill,discountpercent)
          //console.log(amountafterdiscount)
          const u = {
            bill_no: billno,
            order_id: order.order_id,
            customer_id: order.customer_id,
            restaurant_id: order.restaurant_id,
            table_number: order.table_number,
            order_items: order.order_items,
            total_quantity: order.total_quantity,
            initial_bill: order.initial_bill,
            cgstamount: cgst,
            sgstamount: sgst,
            tax: (parseFloat(cgst)+parseFloat(sgst)).toFixed(2),
            discountpercent: discountpercent,
            discountamount: discountamount,
            discount_description: discountdescription,
            total_bill: total_amount,
            order_status: "billgenerated",
          };
          const confirmorder = new CompletedOrders(u);
          const result = await confirmorder.save();
          //console.log(result);

          if (result) {
            const a = await Orders.findOneAndUpdate(
              { order_id },
              {
                tax: parseFloat(cgst) + parseFloat(sgst),
                total_bill: total_amount,
                order_status: "billgenerated",
              }
            );
            if (a) {
              res.status(200).json({ success: true, data: result });
            } else {
              res
                .status(401)
                .json({ success: false, error: "Couldn't update order store" });
            }
          } else {
            res
              .status(401)
              .json({ success: false, error: "Couldn't generate bill" });
          }
        }
      } else {
        res.status(401).json({ success: false, error: "Not Found" });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: "Not Found" });
    }
  } else {
    res.status(400).json({ success: false, error: "Method Not Allowed" });
  }
};

export default connDB(handler);

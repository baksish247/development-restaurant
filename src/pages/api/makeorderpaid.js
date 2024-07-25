import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";
import Orders from "../../../models/Orders";

const handler=async(req,res)=>{
    if(req.method==='POST'){
        try {
            const{order_id,paymentType,
                cashAmount,
                onlineAmount}=req.body;
                const payment_method={
                    paymentType,
                    cashAmount,
                    onlineAmount
                }
            const a=await CompletedOrders.findOneAndUpdate({order_id},{order_status:"paid",payment_method:payment_method});

            if(a){
                const b=await Orders.findOneAndDelete({order_id});
                    if(b){
                        res.status(200).json({success: true})
                    }else{
                        res.status(201).json({success: false,error:"Couldn't delete order"})
                    }
            }else{
                res.status(201).json({success: false,error:"Couldn't update order status"})
            }            
        } catch (error) {
            res.status(201).json({success: false,error:"Not Found"})
        }
    }
    else{
        res.status(201).json({success: false,error:"Method Not Allowed"})
    }
}

export default connDB(handler);
import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";
import Orders from "../../../models/Orders";

const handler=async(req,res)=>{
    if(req.method==='POST'){
        try {
            //console.log(req.body)
            const{order_id}=req.body;
            const b=await Orders.findOneAndDelete({order_id});
            if(b){
                res.status(200).json({success: true})
            }else{
                res.status(401).json({success: false,error:"Couldn't delete order"})
            }        
        } catch (error) {
            res.status(401).json({success: false,error:"Not Found"})
        }
    }
    else{
        res.status(401).json({success: false,error:"Method Not Allowed"})
    }
}

export default connDB(handler);
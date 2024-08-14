import connDB from "../../../middleware/connDB";
import Orders from "../../../models/Orders";

const handler=async(req,res)=>{
    if(req.method=="POST"){
        try{
            const {order_id,estimated_time}=req.body;
            const u=await Orders.findOneAndUpdate({order_id: order_id},{estimated_time_to_serve:estimated_time});
            if(u){
                res.status(200).json({success:true,message:'Wait time updated successfully'})
            }
            else{
                res.status(201).json({success:false,message:'Error in updating Wait time'})
            }
        }catch(e){
            res.status(202).json({success:false,error:"Internal Server Error"});
        }
    }
    else{
        res.status(202).json({success:false,error:"Incorrect request method"});
    }
}

export default connDB(handler);
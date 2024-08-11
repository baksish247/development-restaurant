import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";


const handler= async(req,res)=>{
    if(req.method=='POST'){
        try{
          const {order_id,phone}=req.body;
          const u=await CompletedOrders.findOneAndUpdate({order_id: order_id},{ customer_phone: phone})
          if(u){
            res.status(200).json({success:true,message:'Phone number updated successfully'})
          }
          else{
            res.status(201).json({success:false,message:'Error in updating phone number'})
          }
        }catch(e){

        }
    }
    else{
        res.status(201).json({message:'Method Not Allowed'})
    }
}

export default connDB(handler);
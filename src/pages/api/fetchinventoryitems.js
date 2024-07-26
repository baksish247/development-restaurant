import connDB from "../../../middleware/connDB";
import InventoryItems from "../../../models/InventoryItems";

const handler=async(req,res)=>{
    try {
        if(req.method=="POST"){
            const {restaurant_id}=req.body;
            const items=await InventoryItems.find({restaurant_id:restaurant_id});
            if(items.length>0){
            res.status(200).json({success:true,data:items});
            }
            else
            {
                res.status(201).json({success:false,error:"No items found"})
            }
        }
    } catch (error) {
        res.status(201).json({success:false,error:"Server Error"})
    }
}
export default connDB(handler);
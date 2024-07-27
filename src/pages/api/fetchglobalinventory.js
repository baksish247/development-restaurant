import connDB from "../../../middleware/connDB";
import GlobalInventory from "../../../models/GlobalInventory";

const handler=async(req,res)=>{
    try {
        if(req.method=="POST"){
            const items=await GlobalInventory.find();
            if(items){
                res.status(200).json({success:true,data:items});
            }
            else{
                res.status(201).json({success:false,error:"No items found"})
            }
        }
        else{
            res.status(201).json({success:false,error:"Method not allowed"})
        }
    } catch (error) {
        res.status(201).json({success:false,error: error.message})
    }
}
export default connDB(handler);
import connDB from "../../../middleware/connDB";
import GlobalMenu from "../../../models/GlobalMenu";

const handler= async(req,res) => {
    try{
        if(req.method=="POST"){
            const {name,description,category,subcategory,image,resid}=req.body;
            const existing=await GlobalMenu.findOne({name:name});
           // console.log(existing)
            if(!existing){
                const newitem=new GlobalMenu({
                    name,description,category,subcategory,image
                })
                const u=await newitem.save();
                if(u){
                    res.status(200).json({success:true,data:u})
                }
                else
                {
                    res.status(201).json({success:false,message:"Failed to save item"})
                }
            }
            else{
                if(resid){
                    const addedresid=await GlobalMenu.findOneAndUpdate({name:name},{ $push: { restaurant_ids: resid } },{ new: true });
                    res.status(200).json({success:true,data:addedresid})
                }
            }
        }
    else{
        res.status(201).json({success:false,message:"Method not allowed"})
    }
    }catch(e){
        res.status(201).json({success:false,error:e.message})
    }
}
export default connDB(handler);
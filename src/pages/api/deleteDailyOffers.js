import connDB from "../../../middleware/connDB";
import DailyOffers from "../../../models/DailyOffers";
import FoodItems from "../../../models/FoodItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const {
        offerid
      } = req.body;

      const offer = await DailyOffers.findByIdAndDelete(offerid);
      if (offer) {
        const item=await FoodItems.findById(offer.food);
        if(item){
          const old=item.oldPrice;
          const updated=await FoodItems.findByIdAndUpdate(offer.food,{price:old,oldPrice:null});
          if(updated){
            res.status(200).json({ success: true, data: updated });
          }else {
            res.status(201).json({ success: false, error: "Could not save offer" });
          }
        }else {
          res.status(201).json({ success: false, error: "Could not save offer" });
        }
        
      } else {
        res.status(201).json({ success: false, error: "Could not delete offer" });
      }
    } catch (error) {
      res.status(202).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);


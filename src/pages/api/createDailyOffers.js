import connDB from "../../../middleware/connDB";
import DailyOffers from "../../../models/DailyOffers";
import FoodItems from "../../../models/FoodItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const {
        itemname,
        itemDescription,
        offerName,
        oldPrice,
        newPrice,
        discount,
        coupon,
        image,
        restaurant_id,
        food
      } = req.body;
      const offer = new DailyOffers({
        itemname,
        itemDescription,
        offerName,
        oldPrice,
        newPrice,
        discount,
        coupon,
        image,
        restaurant_id,
        food
      });

      const u = await offer.save();

      if (u) {
        const item=await FoodItems.findById(food);
        if(item){
          const old=item.price;

          const updated=await FoodItems.findByIdAndUpdate(food,{price:newPrice,oldPrice:old});
          if(updated){
            res.status(200).json({ success: true, data: updated });
          }else {
            const del=await DailyOffers.findByIdAndDelete(u._id)
            res.status(201).json({ success: false, error: "Could not save offer" });
          }
        }else {
          const del=await DailyOffers.findByIdAndDelete(u._id)
          res.status(201).json({ success: false, error: "Could not save offer" });
        }
      
      } else {
        res.status(201).json({ success: false, error: "Could not save offer" });
      }
    } catch (error) {
      res.status(202).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);


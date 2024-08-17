import mongoose from 'mongoose';
import FoodItems from './FoodItems';

const dailyOffersSchema = new mongoose.Schema({
    itemname:{
        type:String,
    },
    itemDescription: {
        type: String,
    },
    offerName: {
        type: String,
    },
    restaurant_id: {
        type: String,
    },
    oldPrice:{
        type: String,
    },
    newPrice: {
        type:String,
    },
    discount: {
        type: String,
    },
    coupon:{
        type:String,
    },
    image:{
        type:String,
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItems'
      },
}, { timestamps: true })

export default mongoose.models.DailyOffers || mongoose.model("DailyOffers", dailyOffersSchema)
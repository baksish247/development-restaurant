import mongoose from 'mongoose';

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
}, { timestamps: true })

export default mongoose.models.DailyOffers || mongoose.model("DailyOffers", dailyOffersSchema)
import mongoose from 'mongoose';
import { singleOrders } from './SingleOrders';

const completedOrders = new mongoose.Schema({
    bill_no:{
        type:String,
    },
    customer_id: {
        type: String,
    },
    order_id: {
        type: String,
    },
    restaurant_id: {
        type: String,
    },
    table_number:{
        type: String,
    },
    order_items: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'SingleOrders'}],
    total_quantity: {
        type:String,
    },
    initial_bill: {
        type: String,
    },
    cgstamount:{
        type:String,
    },
    sgstamount:{
        type:String,
    },
    tax: {
        type: String,
    },
    discountpercent:{
        type:String,
    },
    discountamount:{
        type:String,
    },
    discountdescription:{
        type: String,
    },
    total_bill: {
        type: String,
    },
    order_status:{
        type: String,
    }
}, { timestamps: true })

export default mongoose.models.CompletedOrders || mongoose.model("CompletedOrders", completedOrders)
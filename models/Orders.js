import mongoose from 'mongoose';
import { singleOrders } from './SingleOrders';

const orders = new mongoose.Schema({
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
    initial_bill: {
        type: String,
    },
    tax: {
        type: String,
    },
    discount:{
        type:String,
    },
    total_bill: {
        type: String,
    },
    total_quantity: {
        type:String,
    },
    order_status:{
        type: String,
    },
    waiter_id:{
        type: String,
    },
    waiter_name:{
        type: String,
    },
    served_at:{
        type:Date
    },
    estimated_time_to_serve:{
        type:Date
    },
    customer_name:{
        type:String
    },
    customer_phone:{
        type: String,
    }
}, { timestamps: true })

export default mongoose.models.Orders || mongoose.model("Orders", orders)
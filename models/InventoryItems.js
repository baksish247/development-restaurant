import mongoose from 'mongoose';

const inventoryitemSchema = new mongoose.Schema({
    restaurant_id: {
        type: String,
    },
    item_name: {
        type: String,
    },
    item_code:{
        type:String
    },
    item_group: {
        type: String,
    },
    item_photo: {
        type: String,
    },
    on_hand_amount:{
        type:String,
        default:"0",
    },
    last_purchase_date:{
        type:String,
    },
    last_purchase_amount:{
        type:String,
    },
    purchase_history:{
        type:[Object],
    },
    type: {
        type:String,
    }
}, { timestamps: true });

export default mongoose.models.InventoryItems || mongoose.model('InventoryItems', inventoryitemSchema);

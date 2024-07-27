import mongoose from 'mongoose';

const globalInventoryschema = new mongoose.Schema({
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
    type: {
        type:String,
    }
}, { timestamps: true });

export default mongoose.models.GlobalInventory || mongoose.model('GlobalInventory', globalInventoryschema);

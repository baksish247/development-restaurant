import mongoose from 'mongoose';

const globalmenuschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String,
    },
    image: {
        type: String,
    },
    restaurant_ids:{
        type:[String]
    }
}, { timestamps: true });

export default mongoose.models.GlobalMenu || mongoose.model('GlobalMenu', globalmenuschema);

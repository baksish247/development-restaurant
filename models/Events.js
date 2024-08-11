import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price:String,
    image:String,
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    restaurantname: {
        type: String,
    },
    restaurant_id: {
        type: String,
        required: true,
    },
},{timestamps: true})

export default mongoose.models.Event || mongoose.model('Event', eventSchema);

import mongoose from 'mongoose';
import FoodItems from './FoodItems';

const orderFoodItemsSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItems'
  },
  quantity: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.OrderFoodItems || mongoose.model('OrderFoodItems', orderFoodItemsSchema);

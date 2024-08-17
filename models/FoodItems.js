import mongoose from "mongoose";

const foodItemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
    oldPrice:{
      type:String,
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
    available_status: {
      type: Boolean,
      default: true,
    },
    ingredients: [Object],
  },
  { timestamps: true }
);

export default mongoose.models.FoodItems ||
  mongoose.model("FoodItems", foodItemsSchema);

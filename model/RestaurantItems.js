import mongoose from "mongoose";

const restaurantItemsSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: String,
    },
    restaurant_name: {
      type: String,
    },
    cgst:{
      type:String,
    },
    sgst:{
      type:String,
    },
    food_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItems",
      },
    ],
    nooftables:{
      type:String,
    },
    reviewLink:{
      type:String,
    },

  },
  { timestamps: true }
);

export default mongoose.models.RestaurantItems ||
  mongoose.model("RestaurantItems", restaurantItemsSchema);

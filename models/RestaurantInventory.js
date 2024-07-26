import mongoose from "mongoose";

const restaurantInventorySchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: String,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItems",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.RestaurantInventory || mongoose.model("RestaurantInventory", restaurantInventorySchema);

import connDB from "../../../middleware/connDB";
import CompletedOrders from "../../../models/CompletedOrders";
import InventoryItems from "../../../models/InventoryItems";

const handler = async (req, res) => {
  try {
    if (req.method == "POST") {
      const order = await CompletedOrders.find({
        order_id: req.body.order_id,
      }).populate({
        path: "order_items",
        populate: {
          path: "items",
          populate: {
            path: "food",
            model: "FoodItems",
          },
        },
      });
      if (order) {
        const ingredientTotals = {};

        order.forEach((order) => {
          order.order_items.forEach((orderItem) => {
            orderItem.items.forEach((item) => {
              item.food.ingredients.forEach((ingredient) => {
                const ingredientId = ingredient.ingredient;
                const ingredientQuantity =
                  parseFloat(ingredient.quantity) * parseFloat(item.quantity);

                if (ingredientTotals[ingredientId]) {
                  ingredientTotals[ingredientId] += ingredientQuantity;
                } else {
                  ingredientTotals[ingredientId] = ingredientQuantity;
                }
              });
            });
          });
        });

        const result = Object.keys(ingredientTotals).map((ingredientId) => ({
          item_id: ingredientId,
          new_amount: ingredientTotals[ingredientId],
        }));
        const updatePromises = result.map(async ({ item_id, new_amount }) => {
          const item = await InventoryItems.findById(item_id);

          if (!item) {
            throw new Error(`Item with id ${item_id} not found`);
          }

          const updatedAmount =
            parseFloat(item.on_hand_amount) - parseFloat(new_amount);
          item.on_hand_amount = updatedAmount.toString();

          return item.save();
        });

        const updatedItems = await Promise.all(updatePromises);

        res.status(200).json({ success: true, data: updatedItems });
      }
      else{
        res.status(201).json({ success: false, error: "Order not found" });
      }
    } else {
      res.status(201).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    res.status(201).json({ success: false, error: error.message });
  }
};

export default connDB(handler);

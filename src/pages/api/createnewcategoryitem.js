import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";
import RestaurantItems from "../../../models/RestaurantItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    console.log(req.body);
    const {
      restaurant_id,
      restaurant_name,
      name,
      description,
      price,
      category,
      subcategory,
      image,
      available_status,
    } = req.body;

    try {
      // Check if the item already exists
      let existingFoodItem = await FoodItems.findOne({
        name,
      });

      if (existingFoodItem) {
        // Update the existing item
        existingFoodItem.description = description;
        existingFoodItem.price = price;
        existingFoodItem.category = category;
        existingFoodItem.subcategory = subcategory;
        existingFoodItem.image = image;
        existingFoodItem.available_status = available_status;

        const updatedFoodItem = await existingFoodItem.save();

        if (updatedFoodItem) {
          res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: updatedFoodItem,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Failed to update food item",
          });
        }
      } else {
        // Create a new food item
        const newFoodItem = new FoodItems({
          name,
          description,
          price,
          category,
          subcategory,
          image,
          available_status,
        });

        const savedFoodItem = await newFoodItem.save();
        //console.log(savedFoodItem);

        if (savedFoodItem) {
          // Find the restaurant and update the food items array
          const updatedRestaurant = await RestaurantItems.findOneAndUpdate(
            { restaurant_id },
            { $push: { food_items: savedFoodItem._id } },
            { new: true, upsert: true }
          );
          //console.log(updatedRestaurant);

          if (updatedRestaurant) {
            res.status(201).json({
              success: true,
              message: "Food item added successfully",
              data: savedFoodItem,
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Failed to update restaurant with new food item",
            });
          }
        } else {
          res.status(500).json({
            success: false,
            message: "Failed to save food item",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
};

export default connDB(handler);

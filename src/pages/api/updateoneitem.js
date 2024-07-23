import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";
import RestaurantItems from "../../../models/RestaurantItems";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const {
      restaurant_id,
      restaurant_name,
      fid,
      name,
      description,
      price,
      category,
      subcategory,
      image,
      available_status,
    } = req.body;

    //console.log("Received data:", req.body,"fid",fid);

    try {
      // Find and update the food item, or create it if it doesn't exist
     // console.log(fid);
      
      const updatedFoodItem = await FoodItems.findByIdAndUpdate(
        fid,
        {
          name,
          description,
          price,
          category,
          subcategory,
          image,
          available_status,
        },
        { new: true, upsert: true } // Return the modified document and create if not exists
      );

      //console.log("Updated food item:", updatedFoodItem);

      if (updatedFoodItem) {
        // Respond with the updated food item data
        res.status(201).json({
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
    } catch (error) {
      console.error("Error updating food item:", error);
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

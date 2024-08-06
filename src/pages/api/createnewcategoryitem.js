import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";
import RestaurantItems from "../../../models/RestaurantItems";
import GlobalMenu from "../../../models/GlobalMenu";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const {
    restaurant_id,
    name,
    description,
    price,
    category,
    subcategory,
    image,
    available_status,
    ingredients,
  } = req.body;

  //console.log("Received request body:", req.body);

  try {
    // Check if the item exists in the global menu
    const globalItem = await GlobalMenu.findOne({ name });
    //console.log("Global item found:", globalItem);

    // If the item doesn't exist in the global menu, create it
    if (!globalItem) {
      const newGlobalItem = new GlobalMenu({
        name,
        description,
        category,
        subcategory,
        image,
        restaurant_ids: [restaurant_id],
      });

      await newGlobalItem.save();
      //console.log("New global item created:", newGlobalItem);
    } else if (!globalItem.restaurant_ids.includes(restaurant_id)) {
      // If it exists but doesn't include the current restaurant, update it
      await GlobalMenu.updateOne(
        { name },
        { $addToSet: { restaurant_ids: restaurant_id } }
      );
      //console.log("Global item updated with new restaurant ID");
    }

    // Check if the item exists in the local menu
    let localItem = await FoodItems.findOne({ name, restaurant_id });
   // console.log("Local item found:", localItem);

    if (localItem) {
      // Update existing item
      Object.assign(localItem, {
        description,
        price,
        category,
        subcategory,
        image,
        available_status,
        ingredients,
      });

      await localItem.save();
     // console.log("Local item updated:", localItem);

      return res.status(200).json({
        success: true,
        message: "Food item updated successfully",
        data: localItem,
      });
    } else {
      // Create new item
      const newFoodItem = new FoodItems({
        name,
        restaurant_id,
        description,
        price,
        category,
        subcategory,
        image,
        available_status,
        ingredients,
      });

      const savedFoodItem = await newFoodItem.save();
      //console.log("New food item created:", savedFoodItem);

      // Update the restaurant with the new food item
      const updateResult = await RestaurantItems.updateOne(
        { restaurant_id },
        { $push: { food_items: savedFoodItem._id } },
        { upsert: true }
      );
      //console.log("Restaurant items update result:", updateResult);

      return res.status(201).json({
        success: true,
        message: "Food item added successfully",
        data: savedFoodItem,
      });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default connDB(handler);

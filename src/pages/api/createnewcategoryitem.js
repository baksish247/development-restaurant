// import connDB from "../../../middleware/connDB";
// import FoodItems from "../../../models/FoodItems";
// import RestaurantItems from "../../../models/RestaurantItems";

// const handler = async (req, res) => {
//   if (req.method === "POST") {
//     console.log(req.body);
//     const {
//       restaurant_id,
//       restaurant_name,
//       name,
//       description,
//       price,
//       category,
//       subcategory,
//       image,
//       available_status,
//     } = req.body;

//     try {
//       // Check if the item already exists
//       let existingFoodItem = await FoodItems.findOne({
//         name,
//       });

//       if (existingFoodItem) {
//         // Update the existing item
//         existingFoodItem.description = description;
//         existingFoodItem.price = price;
//         existingFoodItem.category = category;
//         existingFoodItem.subcategory = subcategory;
//         existingFoodItem.image = image;
//         existingFoodItem.available_status = available_status;

//         const updatedFoodItem = await existingFoodItem.save();

//         if (updatedFoodItem) {
//           res.status(200).json({
//             success: true,
//             message: "Food item updated successfully",
//             data: updatedFoodItem,
//           });
//         } else {
//           res.status(500).json({
//             success: false,
//             message: "Failed to update food item",
//           });
//         }
//       } else {
//         // Create a new food item
//         const newFoodItem = new FoodItems({
//           name,
//           description,
//           price,
//           category,
//           subcategory,
//           image,
//           available_status,
//         });

//         const savedFoodItem = await newFoodItem.save();
//         //console.log(savedFoodItem);

//         if (savedFoodItem) {
//           // Find the restaurant and update the food items array
//           const updatedRestaurant = await RestaurantItems.findOneAndUpdate(
//             { restaurant_id },
//             { $push: { food_items: savedFoodItem._id } },
//             { new: true, upsert: true }
//           );
//           //console.log(updatedRestaurant);

//           if (updatedRestaurant) {
//             res.status(201).json({
//               success: true,
//               message: "Food item added successfully",
//               data: savedFoodItem,
//             });
//           } else {
//             res.status(500).json({
//               success: false,
//               message: "Failed to update restaurant with new food item",
//             });
//           }
//         } else {
//           res.status(500).json({
//             success: false,
//             message: "Failed to save food item",
//           });
//         }
//       }
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     res.status(405).json({
//       success: false,
//       message: "Method not allowed",
//     });
//   }
// };

// export default connDB(handler);

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
  console.log(ingredients);

  try {
    // Check if the item exists in the global menu
    const globalItem = await GlobalMenu.findOne({ name });

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
    } else if (!globalItem.restaurant_ids.includes(restaurant_id)) {
      // If it exists but doesn't include the current restaurant, update it
      await GlobalMenu.updateOne(
        { name },
        { $addToSet: { restaurant_ids: restaurant_id } }
      );
    }

    // Check if the item exists in the local menu
    let localItem = await FoodItems.findOne({ name, restaurant_id });

    if (localItem) {
      // Update existing item
      Object.assign(localItem, {
        description,
        price,
        category,
        subcategory,
        image,
        available_status,
      });

      await localItem.save();

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
        ingredients: ingredients,
      });

      const savedFoodItem = await newFoodItem.save();

      // Update the restaurant with the new food item
      await RestaurantItems.updateOne(
        { restaurant_id },
        { $push: { food_items: savedFoodItem._id } },
        { upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: "Food item added successfully",
        data: savedFoodItem,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default connDB(handler);

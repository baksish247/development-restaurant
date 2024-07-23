import connDB from "../../../middleware/connDB";
import FoodItems from "../../../models/FoodItems";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  const { id, status } = req.body;
  //console.log(id, status);

  if (!id || typeof status === "undefined") {
    return res.status(400).json({ message: "ID and status are required" });
  }

  try {
    const foodItem = await FoodItems.findByIdAndUpdate(
      id,
      { available_status: status },
      { new: true }
    );

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ success: true, foodItem });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default connDB(handler);

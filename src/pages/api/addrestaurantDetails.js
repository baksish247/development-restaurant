import connDB from "../../../middleware/connDB";
import RestaurantDetails from "../../../model/RestaurantDetails";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const restaurantDetails = req.body;
      //console.log("Request Body:", restaurantDetails);

      const resr = new RestaurantDetails(restaurantDetails);
      //console.log("New Restaurant Object:", resr);

      const result = await resr.save();
      //console.log("Save Result:", result);

      if (result) {
        res.json({ success: true, data: result });
      } else {
        throw new Error("Failed to save restaurant details");
      }
    } else {
      res.status(405).json({ success: false, data: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ success: false, data: "Failed to fetch restaurant details", error: error.message });
  }
};

export default connDB(handler);

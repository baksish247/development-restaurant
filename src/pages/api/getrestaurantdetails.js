import connDB from "../../../middleware/connDB";
import RestaurantDetails from "../../../model/RestaurantDetails";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const restaurantid = req.body.restaurantid;
      //console.log(restaurantid);
      const restaurant = await RestaurantDetails.findOne({ restaurantid });
      //console.log(restaurant);
      if (restaurant) res.json({ success: true, data: restaurant });
      else throw new Error();

      //res.status(200).json({ success: true, data: restaurant });
    } else {
      res.status(405).json({ success: false, message: "Method not allowed" });
    }
  } catch (err) {
    //console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export default connDB(handler);

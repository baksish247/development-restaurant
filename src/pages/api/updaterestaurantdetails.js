import connDB from "../../../middleware/connDB";
import RestaurantDetails from "../../../models/RestaurantDetails";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const {
        restaurantid,
        restaurantname,
        restaurantlocation,
        restaurantphoneNo,
        restaurantemail,
        restaurantwebsite,
        restaurantaddress,
        restaurantopeninghours,
        restaurantclosinghours,
        restaurantdescription,
        noofchefs,
        noofemployees,
        nooftables,
        noofwaiters,
        noofseatingcapacity,
        sgst,
        cgst,
        gstin,
        verified
      } = req.body;

      if (!restaurantid) {
        return res.status(400).json({ success: false, message: "Restaurant ID is required" });
      }

      // Find and update the restaurant details
      const updatedRestaurant = await RestaurantDetails.findOneAndUpdate(
        { restaurantid: restaurantid },
        {
          restaurantname,
          restaurantlocation,
          restaurantphoneNo,
          restaurantemail,
          restaurantwebsite,
          restaurantaddress,
          restaurantopeninghours,
          restaurantclosinghours,
          restaurantdescription,
          noofchefs,
          noofemployees,
          nooftables,
          noofwaiters,
          noofseatingcapacity,
          sgst,
          cgst,
          gstin,
          verified
        },
        { new: true, runValidators: true }
      );

      if (!updatedRestaurant) {
        return res.status(404).json({ success: false, message: "Restaurant not found" });
      }

      return res.status(200).json({ success: true, data: updatedRestaurant });
    } catch (err) {
      //console.log(err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
};

export default connDB(handler);

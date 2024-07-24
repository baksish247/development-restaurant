import connDB from "../../../middleware/connDB";

const { default: RestaurantItems } = require("../../../models/RestaurantItems");

const handler = async (req, res) => {
  try {
    if (req.method == "POST") {
      const {
        table_number,
        restaurant_id,
        phoneNumber,
        numberOfPeople,
        reserve,
      } = req.body;
      if (reserve) {
        const reserved_tables = {
          table_number,
          phoneNumber,
          numberOfPeople,
        };
        const reservation = await RestaurantItems.findOneAndUpdate(
          { restaurant_id },
          { $push: { reserved_tables: reserved_tables } },
          { new: true }
        );
        if (reservation) {
          res.status(200).json({ success: true, data: reservation });
        } else {
          res
            .status(201)
            .json({ success: false, message: "Failed to reserve table" });
        }
      } else if (!reserve) {
        const reservation = await RestaurantItems.findOneAndUpdate(
            { restaurant_id },
            { $pull: { reserved_tables: { table_number: table_number } } }, // Remove the object based on table_number
            { new: true }
          );
  
          if (reservation) {
            res.status(200).json({ success: true, data: reservation });
          } else {
            res.status(201).json({ success: false, message: "Failed to remove reservation" });
          }
      }
    } else {
      res.status(201).json({ success: false, message: "Method not allowed" });
    }
  } catch (e) {
    res.status(201).json({ success: false, message: e.message });
  }
};
export default connDB(handler);

import connDB from "../../../middleware/connDB";

const { default: DailyOffers } = require("../../../models/DailyOffers");

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { resid } = req.body;
      const offers = await DailyOffers.find({ restaurant_id: resid });
      if (offers) {
        res.status(200).json({ success: true, data: offers });
      } else {
        res
          .status(201)
          .json({ success: false, error: "Could not update offer" });
      }
    } catch (error) {
      res.status(202).json({ success: false, error: error.message });
    }
  } else {
    res.status(205).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);

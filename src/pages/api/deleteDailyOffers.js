import connDB from "../../../middleware/connDB";
import DailyOffers from "../../../models/DailyOffers";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const {
        offerid
      } = req.body;

      const offer = await DailyOffers.findByIdAndDelete(offerid);
      if (offer) {
        res.status(200).json({ success: true, data: offer });
      } else {
        res.status(201).json({ success: false, error: "Could not delete offer" });
      }
    } catch (error) {
      console.error("Error occurred while saving offer:", error.message);
      res.status(202).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);


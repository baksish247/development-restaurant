// pages/api/events/getAllEvents.js
import connDB from "../../../middleware/connDB";
import Events from "../../../models/Events";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { restaurant_id } = req.query; 
      const filter = restaurant_id ? { restaurant_id } : {};
      const events = await Events.find(filter).sort({ createdAt: -1 }); // Fetch events and sort by most recent
      res.status(200).json({success:true,events:events});
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: "Error fetching events" });
    }
  } else {
    res.status(405).json({success:false, message: "Method not allowed" });
  }
};

export default connDB(handler);

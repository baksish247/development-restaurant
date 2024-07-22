import connDB from "../../../middleware/connDB";
import Waiter_credentials from "../../../model/Waiter_credentials";

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const {restaurant_id} = req.body;
      const waiters = await Waiter_credentials.find({restaurant_id});
      res.status(200).json({ success: true, data: waiters });
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ success: false, error: "Error occurred while fetching waiters" });
  }
};

export default connDB(handler);

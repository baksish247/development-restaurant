import connDB from "../../../middleware/connDB";
import Waiter_credentials from "../../../models/Waiter_credentials";

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { waiter_ids } = req.body;
      console.log(waiter_ids)
      if (!waiter_ids || !Array.isArray(waiter_ids) || waiter_ids.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid waiter_ids" });
      }

      console.log("Received waiter_ids:", waiter_ids);

      const waiters = await Waiter_credentials.deleteMany({ _id: { $in: waiter_ids } });
      
      if (waiters.deletedCount === 0) {
        return res.status(404).json({ success: false, error: "No waiters found to delete" });
      }

      console.log("Deleted waiters:", waiters);
      res.status(200).json({ success: true, data: waiters });
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ success: false, error: "Error occurred while deleting waiters" });
  }
};

export default connDB(handler);

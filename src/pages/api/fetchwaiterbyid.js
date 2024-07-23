// /pages/api/fetchwaiterbyid.js
import connDB from "../../../middleware/connDB";
import Waiter_credentials from "../../../models/Waiter_credentials";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { waiterid } = req.body;
      const waiter = await Waiter_credentials.findById(waiterid);
      if (!waiter) {
        return res.status(404).json({ success: false, error: "Waiter not found" });
      }
      res.status(200).json({ success: true, data: waiter });
    } else if (req.method === "PUT") {
      const { id } = req.query;
      const updatedWaiter = await Waiter_credentials.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedWaiter) {
        return res.status(404).json({ success: false, error: "Waiter not found" });
      }
      res.status(200).json({ success: true, data: updatedWaiter });
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ success: false, error: "Error occurred while fetching waiter details" });
  }
};

export default connDB(handler);

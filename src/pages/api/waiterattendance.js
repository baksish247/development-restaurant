import connDB from "../../../middleware/connDB";
import Waiter_credentials from "../../../model/Waiter_credentials";

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { waiterId, ispresent } = req.body;
      const updatedWaiter = await Waiter_credentials.findByIdAndUpdate(
        waiterId,
        { ispresent },
        { new: true }
      );
      if (updatedWaiter) {
        res.status(200).json({ success: true, data: updatedWaiter });
      } else {
        res.status(404).json({ success: false, error: "Waiter not found" });
      }
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ success: false, error: "Error occurred while updating waiter status" });
  }
};

export default connDB(handler);

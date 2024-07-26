import connDB from "../../../middleware/connDB";
import GlobalMenu from "../../../models/GlobalMenu";

const handler = async (req, res) => {
  const { restaurantId } = req.body;
  console.log(restaurantId);
  try {
    const globalMenuItems = await GlobalMenu.find({
      restaurant_ids: { $ne: restaurantId },
    });
    // console.log(globalMenuItems);

    res.status(200).json({ success: true, data: globalMenuItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default connDB(handler);

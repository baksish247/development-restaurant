import connDB from "../../../middleware/connDB";
import Events from "../../../models/Events";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { title, description, date, time, place, price, image, restaurant_id, restaurantname } = req.body;

      const newEvent = new Events({
        title,
        description,
        date,
        time,
        location: place,
        price,
        image,
        restaurant_id,
        restaurantname,
      });

      await newEvent.save();
      res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding event" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connDB(handler);

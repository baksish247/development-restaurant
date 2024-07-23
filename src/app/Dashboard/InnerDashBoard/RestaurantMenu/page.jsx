"use client";
import React, { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";

function Menupage() {
  const {
    user: { restaurantid },
  } = useAuth();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const { data } = await axios.post("/api/fetchmenubyid", {
          restaurant_id: restaurantid,
        });
        if (data.success) {
          setFoodItems(data.data.food_items);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [restaurantid]);

  const handleStatusChange = (id, newState) => {
    setFoodItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, available_status: newState } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  const categories = [
    "starters",
    "main course",
    "desserts",
    "beverages",
    "breads",
  ];

  return (
    <div className="lg:p-10 p-4 space-y-4">
      {categories.map((category) => (
        <React.Fragment key={category}>
          <p className="font-semibold text-xl capitalize">{category}</p>
          <div className="justify-items-center items-center grid lg:grid-cols-4 grid-cols-1 gap-6">
            {foodItems
              .filter(
                (item) =>
                  item.category?.toLowerCase() === category.toLowerCase()
              )
              .map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Menupage;

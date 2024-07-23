"use client";
import React, { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

function Menupage() {
  const {
    user: { restaurantid },
  } = useAuth();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  const categoriesOrder = [
    "starters",
    "main course",
    "desserts",
    "beverages",
    "breads",
  ];

  const categorizedItems = categoriesOrder
    .map((category) => ({
      category,
      items: filteredItems.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      ),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <div className="lg:p-10 p-4">
      <div className="flex justify-end relative w-fit ml-auto ">
        <FaSearch className="absolute text-gray-500 left-2 z-20 top-3" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 pl-8 border drop-shadow-md rounded-md"
        />
      </div>
      <div className="space-y-4">
        {categorizedItems.map(({ category, items }) => (
          <React.Fragment key={category}>
            <p className="font-semibold text-xl capitalize">{category}</p>
            <div className="justify-items-center items-center grid lg:grid-cols-4 grid-cols-1 gap-6">
              {items.map((item) => (
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
    </div>
  );
}

export default Menupage;

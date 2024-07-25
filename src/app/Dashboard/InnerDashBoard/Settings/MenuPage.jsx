"use client";
import React, { useEffect, useState } from "react";
import MenuCardLong from "./Components/MenuCardLong";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";
import AddItemModal from "./Components/AddItemModal";

function MenuPage() {
  const {
    user: { restaurantid },
  } = useAuth();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const handleEditItem = (id) => {
    console.log("Edit item:", id);
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
    <div className="relative lg:p-6 p-4">
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
                <MenuCardLong
                  key={item._id}
                  item={item}
                  onItemDeleted={handleDeleteItem}
                  onItemEdited={handleEditItem}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={handleAddItem}
        className="fixed bottom-4 right-4 bg-[#441029] text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <FaPlus className="text-lg" />
      </button>
      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default MenuPage;

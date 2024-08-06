"use client";
import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import vegicon from "../../../../assets/images/vegicon.png";
import nonvegicon from "../../../../assets/images/nonvegicon.png";
import Image from "next/image";

function MenuCardLong({ item, onItemAdded, onItemDeleted, onItemEdited ,restaurant_id}) {
  const [loading, setLoading] = useState(false);

  const handleAddItem = async () => {
    if (confirm("Are you sure you want to add this item?")) {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/additem", { id: item._id });
        if (data.success) {
          onItemAdded(item._id); // Notify parent of the item addition
        } else {
          console.error("Failed to add item:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while adding item:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteItem = async () => {
   // console.log(item);
    if (confirm("Are you sure you want to delete this item?")) {
      setLoading(true);
   
      try {
        const { data } = await axios.post("/api/deleteFoodItem", { id: item._id ,restaurant_id:restaurant_id, name:item.name});
        if (data.success) {
          onItemDeleted(item._id); // Notify parent of the item deletion
        } else {
          console.error("Failed to delete item:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while deleting item:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditItem = () => {
    onItemEdited(item._id); // Notify parent to edit the item
  };

  return (
    <div className="bg-white drop-shadow-lg shadow-slate-400 rounded-lg border min-h-24 w-[250px] p-2">
      <div className="flex justify-center items-center">
        <img 
          src={item?.image} 
          className="w-full h-[150px] object-cover rounded-md" 
          alt={item.name} 
        />
      </div>
      <div className="grid grid-cols-4 justify-items-stretch items-center my-2">
        <h3
          className="font-semibold text-base text-zinc-800 col-span-3 truncate"
          title={item.name}
        >
          {item.name}
        </h3>
        <span className="font-medium text-gray-700 text-right">
          ₹{item.price}
        </span>
      </div>
      <div className="mt-1 flex justify-between items-center">
        <Image
          src={item.subcategory.toLowerCase() === "veg" ? vegicon : nonvegicon}
          height={20}
          width={20}
          alt="Category Icon"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleEditItem}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={handleDeleteItem}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>
      <div className="mt-2 flex justify-center">
       
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
          <div className="w-8 h-8 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default MenuCardLong;

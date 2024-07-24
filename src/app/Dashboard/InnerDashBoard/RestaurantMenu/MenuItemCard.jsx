'use client'
import React, { useState } from "react";
import axios from "axios";
// import { RiArrowDropRightLine } from "react-icons/ri";
import Switch from "../WaiterManagement/Switch";
import vegicon from '../../../assets/images/vegicon.png';
import nonvegicon from '../../../assets/images/nonvegicon.png';
import Image from "next/image";

function MenuItemCard({ item, onStatusChange }) {
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = async (event) => {
    if (confirm(`Are you sure you want to make it ${event.target.checked ? 'Available' : 'Unavailable'}`)) {
      const newState = event.target.checked;
      setLoading(true);
      try {
        const { data } = await axios.post("/api/menustatusupdate", {
          id: item._id,
          status: newState,
        });
        if (data.success) {
          onStatusChange(item._id, newState); // Notify parent of the status change
        } else {
          console.error("Failed to update food item status:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while updating food item status:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white drop-shadow-lg shadow-slate-400 rounded-lg border min-h-24 w-[250px] p-2">
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
        <div className="relative flex items-center">
          <Switch isChecked={item.available_status} handleChange={handleSwitchChange} />
          {loading && (
            <div className="absolute flex justify-start items-center  -right-24 space-x-1 top-1/2 transform -translate-y-1/2 ml-2">
              <div className="w-4 h-4 border-2 border-[#441029] rounded-full border-t-transparent animate-spin"></div>
             <p className="text-sm">updating</p> 
            </div>
          )}
        </div>
        <Image src={item.subcategory.toLowerCase()==='veg'?vegicon:nonvegicon} height={20} width={20}/>
        {/* <span className="text-sm inline-flex items-center cursor-pointer text-[#441029] hover:text-[#661638] duration-300">
          Details
          <RiArrowDropRightLine className="text-lg" />
        </span> */}
      </div>
    </div>
  );
}

export default MenuItemCard;

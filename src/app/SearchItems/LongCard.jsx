"use client"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQuantity } from "../redux/CartSlice";
import toast, { Toaster } from 'react-hot-toast';

import {FaPlus as AddIcon} from 'react-icons/fa';
import {FaMinus as RemoveIcon} from 'react-icons/fa';

function LongCard({ item }) {
  const cart = useSelector((state) => state?.cart);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItem({ _id: item._id, name: item.name, price: item.price, quantity: 1 }));
  };

  const handleRemoveItem = () => {
    dispatch(removeItem({ _id: item._id }));
  };

  const handleUpdateQuantity = (quantity) => {
    if (quantity < 0) {
      dispatch(updateQuantity({ _id: item._id, quantity: 0 }));
    } else if (quantity > 50) {
      toast.error("Quantity cannot be more than 50");
    } else {
      dispatch(updateQuantity({ _id: item._id, quantity }));
    }
  };

  const cartItem = cart.items.find(cartItem => cartItem._id === item._id);
  

  return (
    <div className="flex items-center space-x-12 p-2 bg-transparent space-y-2">
      <div className="flex-grow w-2/5">
        <h2 className="text-lg font-semibold text-[#2f2f2f]">{item?.name}</h2>
        <p>₹ {item?.price}</p>
        <p className="text-[9px] text-start text-[#565556]">{item.description}</p>
      </div>
      <div className="w-2/5 flex justify-end relative">
        <img className="h-24 w-40 object-cover object-center -z-10 shadow-md" src={item.image} alt="item" />
        <div className="absolute rounded-lg px-2 py-[2px] -bottom-2 lg:right-24 lg:left-[60%] -left-4 bg-[#FFF9EA] text-[#966729] border-[#966729] border-2 hover:scale-90 duration-200 font-semibold mb-2 flex items-center space-x-2 text-2xl">
          {cartItem?.quantity >0 ? (
            <div className="flex justify-center text-center w-full items-center space-x-2 ">
              <span  onClick={() => handleUpdateQuantity(cartItem.quantity - 1)} className="cursor-pointer"><RemoveIcon/></span>
              <span className="text-base">{cartItem.quantity}</span>
              <span onClick={() => handleUpdateQuantity(cartItem.quantity + 1)} className="cursor-pointer"><AddIcon/></span>
              
            </div>
          ) : (
            <span onClick={handleAddItem} className="cursor-pointer text-xl w-full text-center">Add</span>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default LongCard;

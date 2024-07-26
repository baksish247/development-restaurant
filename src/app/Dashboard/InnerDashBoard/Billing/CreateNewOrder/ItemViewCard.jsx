"use client";
import React, { useState } from "react";
import axios from "axios";
// import { RiArrowDropRightLine } from "react-icons/ri";
import vegicon from "../../../../assets/images/vegicon.png";
import nonvegicon from "../../../../assets/images/nonvegicon.png";
import Image from "next/image";
import { addItem, removeItem, updateQuantity } from "@/app/redux/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

function ItemViewCard({ item }) {
  const cart = useSelector((state) => state?.cart);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(
      addItem({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })
    );
  };

  const handleRemoveItem = () => {
    dispatch(removeItem({ _id: item._id }));
  };
  const handleUpdateQuantity = (quantity) => {
    //console.log(quantity);
    if (quantity < 0) {
      dispatch(updateQuantity({ _id: item._id, quantity: 0 }));
    } else if (quantity > 50) {
      toast.error("Quantity cannot be more than 50");
    } else {
      dispatch(updateQuantity({ _id: item._id, quantity }));
    }
  };

  const cartItem = cart.items.find((cartItem) => cartItem._id === item._id);

  // console.log(item);
  const [itemName, setItemName] = useState("");
  return (
    <div
      key={item._id}
      className={`border-b border-gray-300 py-2 cursor-pointer flex justify-between space-x-4 items-center pr-1 `}
    >
      <div>
        <p className="font-semibold">{item.name}</p>
        <p>{item.description}</p>
      </div>
      <button className="outline px-2 rounded-md">
        {cartItem?.quantity > 0 ? (
          <div className="flex justify-center text-center w-full items-center space-x-2 ">
            <span
              onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
              className="cursor-pointer"
            >
              <FaMinus />
            </span>
            <span className="text-base">{cartItem.quantity}</span>
            <span
              onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
              className="cursor-pointer"
            >
              <FaPlus />
            </span>
          </div>
        ) : (
          <span
            onClick={handleAddItem}
            className="cursor-pointer text-xl w-full text-center"
          >
            Add
          </span>
        )}
      </button>
    </div>
  );
}

export default ItemViewCard;

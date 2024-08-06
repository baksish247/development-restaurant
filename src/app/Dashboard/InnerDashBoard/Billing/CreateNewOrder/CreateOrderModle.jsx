"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import Spinner from "../../Settings/Components/Spinner";
import {
  addItem,
  clearCart,
  removeItem,
  updateQuantity,
} from "@/app/redux/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemViewCard from "./ItemViewCard";
import { MdDelete } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { HiShoppingBag } from "react-icons/hi";
import {FaPlateWheat} from 'react-icons/fa6'

const CreateOrderMoodle = ({ openflag, onClose, fetchorders }) => {
  const { user } = useAuth();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [confirmorder, setconfirmorder] = useState(false)
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderMode, setOrderMode] = useState(null);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      axios
        .post("/api/fetchmenubyid", { restaurant_id: user.restaurantid })
        .then((response) => {
          if (response.data.success) {
            setMenuItems(response.data.data.food_items);
          } else {
            toast.error(response.data.error || "Failed to fetch menu items.");
          }
        })
        .catch((error) => {
          console.error("Error fetching menu items:", error);
          toast.error("Error fetching menu items. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleRemoveItem = (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(removeItem({ _id: item._id }));
    }
  };

  const handleUpdateQuantity = (change, item) => {
    const cartItem = cart.items.find((cartItem) => cartItem._id === item._id);
    const newQuantity = cartItem ? cartItem.quantity + change : 0;

    if (newQuantity < 0) {
      dispatch(updateQuantity({ _id: item._id, quantity: 0 }));
    } else if (newQuantity > 50) {
      toast.error("Quantity cannot be more than 50");
    } else {
      dispatch(updateQuantity({ _id: item._id, quantity: newQuantity }));
    }
  };

  const handlePlaceOrder = async (mode) => {
    toast.loading("Placing order...")
    const customerId = "CUS_" + uuidv4();
    const orderId = "ORD_" + uuidv4();
    const cgst = 0; // Placeholder: Replace with actual CGST value
    const sgst = 0; // Placeholder: Replace with actual SGST value
    const nettax = (0.01 * (cart.totalPrice * (cgst + sgst))).toFixed(2);

    const orderDetails = {
      customer_id: customerId,
      order_id: orderId,
      restaurant_id: user.restaurantid,
      table_number: mode === "parcel" ? "parcel" : tableNumber,
      order_items: [
        {
          items: cart.items,
          notes: "",
          item_total: cart.totalPrice.toFixed(2),
          charges: nettax,
          total_price: (
            parseFloat(cart.totalPrice) + parseFloat(nettax)
          ).toFixed(2),
          status: "Confirmed",
        },
      ],
      total_quantity: cart.totalQuantity,
      initial_bill: cart.totalPrice.toFixed(2),
      tax: nettax,
      total_bill: (parseFloat(cart.totalPrice) + parseFloat(nettax)).toFixed(2),
    };

    try {
      const response = await axios.post(
        "/api/createnewcustomerorder",
        orderDetails
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Order placed successfully");
        setTimeout(() => {
          toast.dismiss();
          onClose();
        }, 1000);
      } else {
        toast.error(response.data.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "We are facing some technical issues. Please try again later."
      );
    } finally {
      dispatch(clearCart());
      fetchorders(user.restaurantid)
    }
  };

  if (!openflag) return null;

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-4xl w-full h-fit flex">
        <button
          onClick={()=>{dispatch(clearCart());onClose();}}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <Toaster />

        <div className="w-1/3 border-r pr-4">
          <input
            type="text"
            placeholder="Search your item name"
            className="px-4 w-full border-2 py-3 rounded-md mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="h-96 overflow-auto noscrollbar">
            {isLoading ? (
              <Spinner />
            ) : (
              filteredItems.map((item) => (
                <ItemViewCard key={item._id} item={item} />
              ))
            )}
          </div>
        </div>

        <div className="w-2/3 pl-4 max-h-[450px] noscrollbar overflow-auto relative">
          <p className="text-lg text-zinc-600">Your Cart</p>
          <hr className="border border-zinc-700 w-[20%]" />
          <div className="mt-2 max-h-[450px] pb-10 h-[400px] overflow-y-auto">
            {cart?.items?.map((item) => (
              <div
                key={item._id}
                className="drop-shadow-lg flex border-b-2 justify-between items-center bg-white h-20 w-full p-2"
              >
                <div>
                  <p>Name: <span className="capitalize">{item?.name}</span></p>
                  <p>Price: {item?.price}</p>
                </div>
                <div className="flex justify-center items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <span
                      className="bg-orange-500 cursor-pointer px-2 rounded font-bold text-white"
                      onClick={() => handleUpdateQuantity(-1, item)}
                    >
                      -
                    </span>
                    <span>{item.quantity}</span>
                    <span
                      className="bg-orange-500 cursor-pointer px-2 rounded font-bold text-white"
                      onClick={() => handleUpdateQuantity(1, item)}
                    >
                      +
                    </span>
                  </div>
                  <button onClick={() => handleRemoveItem(item)}>
                    <MdDelete className="size-8 text-red-500 cursor-pointer" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setOrderMode("select")}
            disabled={cart.items.length==0}
            className="bg-orange-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded absolute right-4 bottom-4"
          >
            Place Order
          </button>
        </div>
      </div>

      {orderMode === "select" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-md w-full">
            <button
              onClick={() => setOrderMode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <p className="text-lg font-bold mb-4">Select Order Mode</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setOrderMode("parcel");
                  setTimeout(() => handlePlaceOrder("parcel"), 0); // Ensure the state is updated
                }}
                className="bg-orange-500 text-white flex space-x-1 justify-center items-center  font-bold py-2 px-4 rounded"
              >
              <HiShoppingBag className="size-5"/><span>Parcel</span>
              </button>
              <button
                onClick={() => {
                  setOrderMode("dinein");
                  
                }}
                className="bg-amber-500 flex justify-center space-x-2 items-center  text-white font-bold py-2 px-4 rounded"
              >
               <FaPlateWheat className="size-4"/><span>Dine In</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {orderMode === "dinein" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-md w-full">
            <button
              onClick={() => setOrderMode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <p className="text-lg font-bold mb-4">Enter Table Number</p>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Table Number"
              className="px-4 py-2 border rounded w-full mb-4"
            />
            <button
              onClick={() => {handlePlaceOrder("dinein"); setconfirmorder(true)}}
              disabled={confirmorder}
              className="bg-orange-500 disabled:bg-zinc-500 disabled:cursor-not-allowed  text-white font-bold py-2 px-4 rounded"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderMoodle;

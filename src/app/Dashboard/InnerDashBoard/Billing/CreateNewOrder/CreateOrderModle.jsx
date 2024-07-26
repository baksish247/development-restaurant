"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import Spinner from "../../Settings/Components/Spinner";
import { addItem, removeItem, updateQuantity } from "@/app/redux/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemViewCard from "./ItemViewCard";

const CreateOrderMoodle = ({ items, edit, openflag, onClose, onItemAdded }) => {
  const { user } = useAuth();
  const cart = useSelector((state) => state?.cart);
  console.log(cart);
  const dispatch = useDispatch();
  const [menuitems, setmenuitems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Starters");
  const [itemType, setItemType] = useState("Veg");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      axios
        .post("/api/fetchmenubyid", { restaurant_id: user.restaurantid })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setmenuitems(response.data.data.food_items);
          }
        })
        .catch((error) => {
          console.error("Error fetching global menu items:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  if (!openflag) return null;

  const filteredItems = menuitems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    console.log(item);
    addItem(item);
    console.log(cart);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-4xl w-full h-fit flex">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <div className="w-1/3 border-r pr-4">
          <input
            type="text"
            placeholder="Search your item name"
            name="search"
            className="px-4 w-full border-2 py-3 rounded-md mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="h-96 overflow-auto noscrollbar">
            {isLoading ? (
              <Spinner />
            ) : (
              filteredItems.map((item) => <ItemViewCard item={item} />)
            )}
          </div>
        </div>

        <div className={`w-2/3 pl-4`}>
          <p className="text-lg text-zinc-600">Your Cart</p>
          <hr className="border border-zinc-700 w-[20%]" />
          <div className="mt-2">
            {cart?.items?.map((item) => (
              <div
                key={item._id}
                className="drop-shadow-lg flex justify-between items-center bg-white h-20 w-full p-2"
              >
                <div>
                  <p>name : {item?.name}</p>
                  <p>price : {item?.price}</p>
                </div>
                <div className="flex justify-center items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <span className="bg-fuchsia-950 px-2 rounded font-bold text-white">-</span>
                    <span>{item.quantity}</span>
                    <span className="bg-fuchsia-950 px-2 rounded font-bold text-white">+</span>
                  </div>
                  <button>delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderMoodle;

"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import { CldUploadWidget } from "next-cloudinary";
import toast, { Toaster } from "react-hot-toast";

const OfferModal = ({ offers, edit, isOpen, onClose, onOfferAdded ,fetchOffers}) => {
  const { user } = useAuth();

  const [globalMenuItems, setGlobalMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [itemname, setitemname] = useState("");
  const [itemDescription, setitemDescription] = useState("");
  const [offerName, setOfferName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [offerDiscount, setOfferDiscount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [offerImage, setOfferImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [fooditem, setfooditem] = useState(null)

  const fetchGlobalMenuItems = async () => {
    try {
      const { data } = await axios.post("/api/fetchmenubyid", {
        restaurant_id: user.restaurantid,
      });
      if (data.success) {
        setGlobalMenuItems(data.data.food_items);
      }
    } catch (error) {
      console.error("Error fetching global menu items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchGlobalMenuItems();
    }
  }, [user]);

  useEffect(() => {
    if (offers) {
      setitemname(offers.itemname ?? "");
      setitemDescription(offers.itemDescription ?? "");
      setOfferName(offers.offerName ?? "");
      setOldPrice(offers.oldPrice ?? "");
      setNewPrice(offers.newPrice ?? "");
      setOfferDiscount(offers.discount ?? "");
      setCouponCode(offers.coupon ?? "");
      setOfferImage(offers.image ?? "");
      setImageUrl(offers.image ?? "");
      setfooditem(offers.food??null);
    }
  }, [offers]);

  const handleImageUpload = (result) => {
    if (result.event === "success") {
      const url = result.info.secure_url;
      setOfferImage(url);
      setImageUrl(url);
    }
  };

  const handleImageUrlChange = (event) => {
    const url = event.target.value || "";
    setImageUrl(url);
    setOfferImage(url);
  };

  const handleSubmit = async (event) => {
    setButtonClicked(true);
    event.preventDefault();

    if (!itemname || !newPrice || !offerImage) {
      setButtonClicked(false);
      setErrorMessage(
        "Please fill in all required fields and provide an image."
      );
      return;
    }
    const d = {
      title: itemname,
      description: itemDescription,
      offerName: offerName,
      oldPrice: oldPrice,
      newPrice: newPrice,
      discount: offerDiscount,
      coupon: couponCode,
      image: offerImage,
      restaurant_id: user.restaurantid,
      // offerid:offers._id?offers._id:null
    }
    //console.log(d);
    

    try {
      if(offers){
        const res=await axios.post("/api/updateDailyOffers", {
          itemname: itemname,
          itemDescription: itemDescription,
          offerName: offerName,
          oldPrice: oldPrice,
          newPrice: newPrice,
          discount: offerDiscount,
          coupon: couponCode,
          image: offerImage,
          offerid:offers._id,
          food:fooditem
        });
        if (res.data.success) {
          toast.success("Offer updated successfully")
        onOfferAdded();
  
        // Reset form and close modal
        setitemname("");
        setitemDescription("");
        setOfferName("");
        setOldPrice("");
        setNewPrice("");
        setOfferDiscount("");
        setCouponCode("");
        setOfferImage("");
        setImageUrl("");
        setErrorMessage("");
        setfooditem(null);
        onClose();
        } else {
          toast.error("Failed to add offer.");
        }
      }
      else{
      const res=await axios.post("/api/createDailyOffers", {
        itemname: itemname,
        itemDescription: itemDescription,
        offerName: offerName,
        oldPrice: oldPrice,
        newPrice: newPrice,
        discount: offerDiscount,
        coupon: couponCode,
        image: offerImage,
        restaurant_id: user.restaurantid,
        food:fooditem
      });
      if (res.data.success) {
        toast.success("Offer created successfully")
      onOfferAdded();

      // Reset form and close modal
      setitemname("");
      setitemDescription("");
      setOfferName("");
      setOldPrice("");
      setNewPrice("");
      setOfferDiscount("");
      setCouponCode("");
      setOfferImage("");
      setImageUrl("");
      setErrorMessage("");
      setfooditem(null);
      onClose();
      } else {
        toast.error("Failed to add offer.");
      }

    }
    } catch (error) {
      toast.error("Failed to make changes");
    } finally {
      fetchOffers();
      setButtonClicked(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = globalMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    //console.log(item)
    setfooditem(item._id);
    setitemname(item.name);
    setitemDescription(item.description);
    setOfferName(""); // Reset offer name field

    setOldPrice(item.price); // Set old price to the item's price
    setNewPrice(""); // Reset new price field
    setOfferDiscount(""); // Reset discount field
    setCouponCode(""); // Reset coupon code field
    setOfferImage(item.image); // Set the image from the item
    setImageUrl(item.image); // Set the image URL field
    setErrorMessage(""); // Reset any error message
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <Toaster/>
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
            placeholder="Search menu items"
            name="search"
            className="px-4 w-full border-2 py-3 rounded-md mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="h-96 overflow-auto noscrollbar">
            {isLoading ? (
              <Spinner />
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className={`border-b border-gray-300 py-2 cursor-pointer ${
                    item.name === itemname ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <p className="font-semibold capitalize">{item.name}</p>
                  <p>{item.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div
          className={`${
            edit ? "w-full p-4" : "w-2/3 pl-4"
          } max-h-[500px] overflow-y-auto noscrollbar`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer">
              <label htmlFor="offerImageInput" className="cursor-pointer">
                {offerImage ? (
                  <img
                    src={offerImage}
                    alt="Offer"
                    className="max-h-32 mx-auto"
                  />
                ) : (
                  <CldUploadWidget onUpload={handleImageUpload}>
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="text-zinc-800 px-4 py-2 rounded-md"
                      >
                        + Upload Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </label>
              <input
                id="offerImageInput"
                type="text"
                placeholder="Or enter image URL"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="mt-2 w-full p-2 border rounded-md"
              />
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={itemname}
                onChange={(e) => setitemname(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Item Description"
                value={itemDescription}
                onChange={(e) => setitemDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Offer Name"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Old Price"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="New Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
             
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white p-2 rounded-md ${
                buttonClicked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={buttonClicked}
            >
              {buttonClicked ? "Processing..." : "Save Offer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;

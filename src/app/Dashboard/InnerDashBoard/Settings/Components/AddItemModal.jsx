"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const AddItemModal = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Starters");
  const [itemType, setItemType] = useState("Veg");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  if (!isOpen) return null;

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resizeImage(reader.result, (resizedImage) => {
          setItemImage(resizedImage);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (event) => {
    const url = event.target.value;
    setImageUrl(url);
    setItemImage(url); // Set the image URL as item image
  };

  const resizeImage = (base64Str, callback) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height *= MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width *= MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.7)); // Adjust the quality if needed
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      itemName,
      itemPrice,
      itemCategory,
      itemType,
      itemDescription,
      itemImage,
    };
    console.log("Form Data: ", formData);
    // Reset form
    setItemName("");
    setItemPrice("");
    setItemCategory("Starters");
    setItemType("Veg");
    setItemDescription("");
    setItemImage("");
    setImageUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-lg w-full h-fit">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer">
            <label htmlFor="itemImageInput" className="cursor-pointer">
              {itemImage ? (
                <img src={itemImage} alt="Item" className="max-h-32 mx-auto" />
              ) : (
                "Add Item Images"
              )}
            </label>
            <input
              id="itemImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <input
              type="text"
              placeholder="Paste Image URL"
              className="w-full mt-2 px-4 py-2 border rounded-md"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          </div>
          <input
            type="text"
            placeholder="Item Name"
            className="w-full px-4 py-2 border rounded-md"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="XXXX INR"
              className="w-full px-4 py-2 border rounded-md"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
            >
              <option>Starters</option>
              <option>Main Course</option>
              <option>Desserts</option>
              <option>Beverages</option>
              <option>Breads</option>
            </select>
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            >
              <option>Veg</option>
              <option>Non-Veg</option>
            </select>
          </div>
          <textarea
            placeholder="Item Description"
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <div className="flex w-full justify-end items-center">
            <button
              type="submit"
              className="w-fit px-4 bg-red-500 text-white py-3 rounded-md"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;

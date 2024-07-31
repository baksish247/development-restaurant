"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import Spinner from "./Spinner"; // Assuming you have a Spinner component

const AddItemModal = ({ items, edit, isOpen, onClose, onItemAdded }) => {
  const { user } = useAuth();
  const [globalMenuItems, setGlobalMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Starters");
  const [itemType, setItemType] = useState("Veg");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [itemInventory, setitemInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // State for inventory ingredients
  const [inventoryItems, setInventoryItems] = useState([]);
  const [ingredients, setIngredients] = useState([
    { ingredient: "", quantity: "" },
  ]);

  const fetchInventoryItemsNames = async () => {
    try {
      const { data } = await axios.post("/api/fetchinventoryitems", {
        restaurant_id: user.restaurantid,
      });
      if (data.success) {
        const itemsNames = data.data
          .filter((item) => item.type === "Measurable")
          .map((item) => ({
            id: item._id,
            name: item.item_name,
          }));
        setInventoryItems(itemsNames);
      }
    } catch (error) {
      console.error("Error fetching inventory items names:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      axios
        .post("/api/globalmenu", { restaurantId: user.restaurantid })
        .then((response) => {
          if (response.data.success) {
            setGlobalMenuItems(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching global menu items:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });

      fetchInventoryItemsNames();
    }
  }, [user]);

  useEffect(() => {
    if (items) {
      setItemName(items.name ?? "");
      setItemPrice(items.price ?? "");
      setItemCategory(items.category ?? "Starters");
      setItemType(items.subcategory ?? "Veg");
      setItemDescription(items.description ?? "");
      setItemImage(items.image ?? "");
      setImageUrl(items.image ?? "");
      setitemInventory(items.ingredients ?? []);
    }
  }, [items]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resizeImage(reader.result, (resizedImage) => {
          setItemImage(resizedImage || "");
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (event) => {
    const url = event.target.value || "";
    setImageUrl(url);
    setItemImage(url);
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

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(newIngredients);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const restaurant_id = user.restaurantid;
    // Basic validation
    if (!itemName || !itemPrice || !itemDescription || !itemImage) {
      setErrorMessage("Please fill in all fields and provide an image.");
      return;
    }

    try {
      await axios.post("/api/createnewcategoryitem", {
        name: itemName,
        restaurant_id: restaurant_id,
        price: itemPrice,
        category: itemCategory,
        subcategory: itemType,
        description: itemDescription,
        image: itemImage,
        ingredients,
      });

      // Notify parent component
      if (onItemAdded) onItemAdded();

      // Reset form and close modal
      setItemName("");
      setItemPrice("");
      setItemCategory("Starters");
      setItemType("Veg");
      setItemDescription("");
      setItemImage("");
      setImageUrl("");
      setIngredients([{ ingredient: "", quantity: "" }]);
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (!isOpen) return null;

  const filteredItems = globalMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    setItemName(item.name || "");
    setItemDescription(item.description || "");
    setItemPrice(item.price || "");
    setItemCategory(item.category || "Starters");
    setItemType(item.subcategory || "Veg");
    setItemImage(item.image || "");
    setImageUrl(item.image || "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 relative shadow-lg max-w-4xl w-full  h-fit flex">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        {!edit && (
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
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`border-b border-gray-300 py-2 cursor-pointer ${
                      item.name === itemName ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p>{item.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            edit ? "w-full p-4" : "w-2/3 pl-4"
          } max-h-[500px] overflow-y-auto`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer">
              <label htmlFor="itemImageInput" className="cursor-pointer">
                {itemImage ? (
                  <img
                    src={itemImage}
                    alt="Item"
                    className="max-h-32 mx-auto"
                  />
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
                placeholder="Price in INR"
                className="w-full px-4 py-2 border rounded-md"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Breads">Breads</option>
              </select>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="Veg">Veg</option>
                <option value="Non Veg">Non Veg</option>
              </select>
            </div>
            <textarea
              placeholder="Item Description"
              className="w-full px-4 py-2 border rounded-md"
              rows="2"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-4"
              >
                <select
                  className="w-[45%] px-4 py-2 border text-black rounded-md"
                  value={ingredient.ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, "ingredient", e.target.value)
                  }
                >
                  <option value="">Select Ingredient</option>
                  {inventoryItems.map((inventoryItem) => (
                    <option key={inventoryItem.id} value={inventoryItem.id}>
                      {inventoryItem.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Quantity in kg"
                  className="w-[45%] px-4 py-2 border rounded-md"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="w-full px-4 py-2 border rounded-md text-blue-500 hover:text-blue-700 flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Ingredient
            </button>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <button
              type="submit"
              className="w-full px-4 bg-orange-500 text-white py-3 rounded-md"
            >
              Save Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;

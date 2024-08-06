"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import { IoMdArrowDropdown } from "react-icons/io";

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 flex items-center  text-left w-full border border-gray-300 rounded-md p-2"
      >
        {value || "Select an option"}
        <span className="absolute right-2 ">
          <IoMdArrowDropdown />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md bg-white max-h-56 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
  const [buttonclicked, setbuttonclicked] = useState(false);
  const [loading, setLoading] = useState(true);

  const options = [
    "Appetizer",
    "Beers",
    "Beverages",
    "Biriyani",
    "Bonda",
    "Bourbon",
    "Breakfast",
    "Brandy",
    "Burger",
    "Chicken",
    "Chicken Mandi",
    "Chinese",
    "Chutney",
    "Coffee",
    "Combo",
    "Desserts",
    "Dips",
    "Donuts",
    "Domestic",
    "Dosa",
    "Egg",
    "Espresso",
    "Fish",
    "Frappe",
    "Fries",
    "Gin",
    "Handi",
    "Idly",
    "Irish",
    "Juice",
    "Latte",
    "Main Course",
    "Maggie",
    "Mashroom",
    "Mocktail",
    "Mughlai",
    "Mutton",
    "Mutton Mandi",
    "Non-Coffee",
    "Non-Vegetarian",
    "Noodle",
    "Others",
    "Paneer",
    "Pancakes",
    "Pastry",
    "Pasta",
    "PavBhaji",
    "Pizza",
    "Poori",
    "Pork",
    "Prawn Mandi",
    "Rice",
    "Rolls",
    "Rotis & Naan",
    "Rava",
    "Salad/Raita",
    "Sandwiches",
    "Scotch",
    "Sea Food",
    "Single Malt",
    "Sizzlers",
    "Smoothie",
    "Snacks",
    "Soup",
    "Specials",
    "Starters",
    "Steak",
    "Sweets",
    "Tandoor & Kebab",
    "Tea",
    "Tequila",
    "Thai Curries",
    "Thali",
    "Toast",
    "Upma",
    "Uttapam",
    "Vegetarian",
    "Veg Mandi",
    "Vodka",
    "Vada",
    "Waffles",
    "Wraps",
    "Qorma",
    "Restaurant Special",
  ];

  const vegchoice = ["Veg", "Non Veg"];

  // State for inventory ingredients
  const [inventoryItems, setInventoryItems] = useState([]);
  const [ingredients, setIngredients] = useState([
    { ingredient: "", name: "", quantity: "" },
  ]);
  const [inventoryhashmap, setInventoryHashMap] = useState({});
  const fetchInventoryItemsNames = async () => {
    try {
      const { data } = await axios.post("/api/fetchinventoryitems", {
        restaurant_id: user.restaurantid,
      });
      if (data.success) {
       // console.log(data.data);
        const itemsNames = data.data
  .filter((item) => item.type === "Measurable")
  .map((item) => ({
    id: item._id,
    name: item.item_name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name)); // Sort the items by name

setInventoryItems(itemsNames);

const itemsMap = data.data
  .filter((item) => item.type === "Measurable")
  .reduce((acc, item) => {
    acc[item._id] = item.item_name;
    return acc;
  }, {});

setInventoryHashMap(itemsMap);

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
      setIngredients(
        items.ingredients?.map((ingredient) => ({
          ingredient: ingredient.ingredient,
          name: inventoryhashmap[ingredient.ingredient],
          quantity: parseFloat(ingredient.quantity) * 1000,
        })) ?? []
      );
    }
  }, [items, inventoryhashmap]);

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
    setIngredients([
      ...ingredients,
      { ingredient: "", name: "", quantity: "" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    if (field == "ingredient") {
      const name = inventoryhashmap[value];
      const newIngredients = ingredients.map((ingredient, i) =>
        i === index
          ? { ...ingredient, ingredient: value, name: name }
          : ingredient
      );
      setIngredients(newIngredients);
    } else {
      const newIngredients = ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      );
      setIngredients(newIngredients);
    }
  };

  const handleSubmit = async (event) => {
    setbuttonclicked(true);
    event.preventDefault();
    const restaurant_id = user.restaurantid;
    // Basic validation
    if (!itemName || !itemPrice || !itemImage) {
      setbuttonclicked(false);
      setErrorMessage("Please fill in all fields and provide an image.");
      return;
    }
    const convert = async () => {
      for (var i = 0; i < ingredients.length; i++) {
        ingredients[i].quantity = (
          parseFloat(ingredients[i].quantity) / 1000.0
        ).toFixed(3);
      }
    };
    await convert();
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
      setIngredients([{ ingredient: "", name: "", quantity: "" }]);
      setErrorMessage("");
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setbuttonclicked(false);
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
          } max-h-[500px] overflow-y-auto noscrollbar`}
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
              {/* <select
                className="w-full px-4 py-2 border rounded-md"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Breads">Breads</option>
              </select> */}
              {/* <label className="block text-sm font-medium text-gray-700">
                Group
              </label> */}
              <CustomDropdown
                options={options}
                value={itemCategory}
                onChange={setItemCategory}
              />
              <CustomDropdown
                options={vegchoice}
                value={itemType}
                onChange={setItemType}
              />
              {/* <select
                className="w-full px-4 py-2 border rounded-md"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="Veg">Veg</option>
                <option value="Non Veg">Non Veg</option>
              </select> */}
            </div>
            <textarea
              placeholder="Item Description"
              className="w-full px-4 py-2 border rounded-md"
              rows="2"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            {/* {items.ingredients?.map((ingredient,i) =>(
              <div
              key={i}
              className="flex justify-center items-center gap-4"
            >
              <input
                className="w-[45%] px-4 py-2 border text-black rounded-md"
                value={ingredient.name}
                readOnly={true}
                
              />
              <input
                type="text"
                className="w-[45%] px-4 py-2 border rounded-md"
                value={ingredient.quantity+" kgs"}
                
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
            ))} */}

            {/* {ingredients.map((ingredient, index) => (
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
            ))} */}
            {/* <button
              type="button"
              onClick={handleAddIngredient}
              className="w-full px-4 py-2 border rounded-md text-blue-500 hover:text-blue-700 flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Ingredient
            </button> */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Ingredients{" "}
                <span className="font-normal">
                  (Enter quantity in grams only*)
                </span>
              </h3>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center mb-2">
                  <select
                    value={ingredient.ingredient}
                    onChange={(e) =>
                      handleIngredientChange(
                        index,
                        "ingredient",
                        e.target.value
                      )
                    }
                    className="px-4 border-2 py-3 rounded-md flex-1 mr-2"
                  >
                    <option value="">Select Ingredient</option>
                    {inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                    className="px-4 border-2 py-3 rounded-md w-[40%] mr-2"
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
                className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
              >
                <FaPlus className="mr-1" /> Add Ingredient
              </button>
            </div>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <button
              type="submit"
              disabled={buttonclicked}
              className="w-full px-4 bg-amber-500 disabled:cursor-not-allowed disabled:bg-amber-600 text-white py-3 rounded-md"
            >
              {buttonclicked ? "Saving Item" : "Save Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;

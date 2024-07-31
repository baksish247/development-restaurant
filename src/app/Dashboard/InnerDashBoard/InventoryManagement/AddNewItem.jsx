import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import AddItemModal from "./AddItemModal";

const itemValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer"),
});

const AddNewItem = ({
  onClose,
  fetchitems,
  currentInventoryItems,
  restaurant_id,
}) => {
  const [globalItems, setGlobalItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchGlobalItems = async () => {
      try {
        const response = await axios.post("/api/fetchglobalinventory");
        setGlobalItems(response.data.data);
      } catch (e) {
        toast.error("Failed to fetch global inventory items");
      }
    };

    fetchGlobalItems();
  }, []);
  const date = new Date();
        const options = { day: "numeric", month: "long", year: "numeric" };
        const formattedDate = date.toLocaleDateString("en-GB", options);
  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: itemValidationSchema,
    onSubmit: async (values) => {
      try {
        
        const response = await axios.post("/api/addinventoryitem", {
          restaurant_id: restaurant_id,
          item_name: selectedItem.item_name,
          item_code: selectedItem.item_code,
          item_group: selectedItem.item_code,
          item_photo: selectedItem.item_photo,
          on_hand_amount: values.amount,
          last_purchase_date: formattedDate,
          last_purchase_amount: values.amount,
          type: selectedItem.type,
        });
        if (response.data.success) {
          toast.success("Item updated successfully");
          fetchitems();
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (e) {
        toast.error("Failed to update item");
      }
    },
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredItems = globalItems
    .filter((item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (globalItem) =>
        !currentInventoryItems.some(
          (currentItem) => currentItem.item_name === globalItem.item_name
        )
    );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async(itemData) => {
    try{
    const res=await axios.post('/api/addinventoryitem',{
      restaurant_id: restaurant_id,
          item_name: itemData.itemName,
          item_group: itemData.group,
          item_photo: "🍳",
          on_hand_amount: itemData.amount,
          last_purchase_date: formattedDate,
          last_purchase_amount: itemData.amount,
          type: itemData.type,
    })
    if(res.data.success){
      fetchitems();
    toast.success("Added successfully")
    setTimeout(() => {
      onClose();
    }, 1000);
    handleCloseModal();
    }
    else{
      toast.error("Failed to add item")
      setTimeout(() => {
        onClose();
      }, 1000);
      handleCloseModal();
    }
  }catch(e){
    toast.error("Failed to add item")
    setTimeout(() => {
      onClose();
    }, 1000);
    handleCloseModal();
  }
  };
  if (!filteredItems) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="fixed z-50 h-screen w-screen top-0 left-0 flex justify-center overflow-x-auto items-center bg-black/20 backdrop-blur-sm">
      <Toaster />
      <div className="bg-white p-6 rounded-md shadow-md max-w-2xl w-full mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-orange-500 p-1 hover:bg-orange-400 hover:text-white"
        >
          <IoMdClose />
        </button>
        <button
              onClick={handleOpenModal}
              className="bg-amber-500 hover:bg-amber-400 absolute right-2 top-12 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
            <AddItemModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSave}
            />
        {filteredItems.length == 0 && (
          <div>
            No inventory item available in global inventory
            <br />
            Add your own item
            
          </div>
        )}
        {filteredItems.length > 0 && (
          <div className="flex">
            <div className="w-1/2 p-4 border-r border-gray-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded w-full mb-4"
              />

              <ul className="max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className="cursor-pointer p-2 space-x-5 grid grid-cols-5 hover:bg-gray-100"
                  >
                    <span className="text-left col-span-1">
                      {item.item_photo}
                    </span>
                    <span className="col-span-4">{item.item_name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-1/2 p-4">
              {selectedItem ? (
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">
                      {selectedItem.item_name} &nbsp;&nbsp;
                      {selectedItem.item_photo}
                    </h2>
                    <p className="text-sm">Code: {selectedItem.item_code}</p>
                    <p className="text-sm">Group: {selectedItem.item_group}</p>
                    <p className="text-sm">
                      Type:{" "}
                      {selectedItem.type === "Measurable"
                        ? "Can be measured per dish"
                        : "Cannot be measured per dish"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Amount to add in stock (in kgs):
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="p-2 rounded-md border-2 w-full"
                      disabled={!selectedItem}
                    />
                    {formik.errors.amount && formik.touched.amount && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.amount}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-white border-2 border-gray-800 text-gray-800 py-2 px-4 rounded-md mr-2"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-[#441029] text-white py-2 px-4 rounded-md"
                      disabled={!selectedItem}
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-500">
                  Select an item to view its details
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewItem;

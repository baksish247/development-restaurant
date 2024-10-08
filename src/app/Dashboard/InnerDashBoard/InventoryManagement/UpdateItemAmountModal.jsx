import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

function UpdateItemModal({ onClose, item, fetchitems }) {
  //console.log(item);
  const [amount, setamount] = useState("");

  const handleupdateamount = async () => {
    toast.loading("Updating amount");
    try {
      if (confirm("Are you sure you want to update the item amount?")) {
        const res = await axios.post("/api/replenishinventoryitem", {
          item_id: item._id,
          amount: amount,
        });
        //console.log(res);
        if (res.data.success) {
          toast.dismiss();
          fetchitems();
          toast.success("Stock updated successfully.");
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          toast.dismiss();
          toast.error("Failed to update stock.");
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (e) {
      toast.error("Invalid amount. Please enter a positive number.");
    }
  };

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <Toaster />
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-[#440129] p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>

          <h2 className="text-lg text-center font-semibold py-1">
            Replenish Item
          </h2>
          <hr className="mb-4 mt-1 border-[0.1px] border-black" />
          <div className="flex flex-col space-y-2">
            <div className="flex justify-start space-x-2">
              <span className="font-semibold">Item Name:</span>
              <span>{item.item_name}</span>
            </div>
            <div className="flex justify-start items-center space-x-2 ">
              <span className="font-semibold text-sm">Item Photo:</span>
              <span className="text-sm">{item.item_photo}</span>
            </div>
            <div className="flex justify-start items-center space-x-2 ">
              <span className="font-semibold text-sm">Item Group:</span>
              <span className="text-sm">{item.item_group}</span>
            </div>
            <div className="flex justify-start items-center space-x-2 ">
              <span className="font-semibold text-sm">
                Current available amount:
              </span>
              <span className="text-sm">{item.on_hand_amount} kgs</span>
            </div>
          </div>
          <div className="flex mt-3 justify-start "></div>
          <hr className="border-[1px] border-dotted border-black my-4" />
          <div className="font-semibold">Enter re-stock amount (in kgs):</div>
          <p className="text-[0.7rem] mb-4">
            (Only enter the amount you are currently adding to your inventory )
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setamount(e.target.value);
            }}
            min={0}
            className="w-full border border-gray-500 rounded-lg px-4 h-10"
          />
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={handleupdateamount}
              className="px-4 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
            >
              Save Changes
            </button>
            <button
              className="px-8 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateItemModal;

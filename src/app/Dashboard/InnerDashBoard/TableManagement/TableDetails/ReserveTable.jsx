import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

function ReserveTableModal({ onClose, fetchorder, table_number, restaurantid }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");

  const handleConfirmReservation = async () => {
    if (!phoneNumber || !numberOfPeople) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Reserving table...");
    try {
      const response = await axios.post("/api/reservetable", {
        table_number,
        restaurant_id: restaurantid,
        phoneNumber,
        numberOfPeople,
        reserve:true
      });

      if (response.data.success) {
        toast.dismiss();
        toast.success("Table reserved successfully");
        fetchorder();
        setTimeout(() => {
          toast.dismiss();
          onClose();
        }, 1000);
      } else {
        throw new Error("Reservation failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to reserve table");
    }
  };

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-[#440129] p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>
    <div>
      <Toaster />
      <h2 className="text-lg text-center font-semibold py-1">Reserve Table</h2>
      <hr className="mb-4 mt-1 border-[0.1px] border-black" />
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col ">
          <label className="font-semibold mb-2">Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border-2 border-black rounded-md p-2"
            placeholder="Enter phone number"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Number of People:</label>
          <input
            type="number"
            value={numberOfPeople}
            min="1"
            onChange={(e) => setNumberOfPeople(e.target.value)}
            className="border-2 border-black rounded-md p-2"
            placeholder="Enter number of people"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={handleConfirmReservation}
          className="px-4 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
        >
          Reserve
        </button>
        <button
          className="px-4 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
    </div>
      </div>
    </div>
  );
}

export default ReserveTableModal;

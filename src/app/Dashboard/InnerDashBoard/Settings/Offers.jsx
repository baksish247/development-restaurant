// Dummy data for offers

"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import OfferModal from "./Components/offerModal";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
const offers = {
  combo: [
    {
      id: 1,
      title: "Combo A",
      description: "Combo of items A and B at a discount.",
      price: "$20",
    },
    {
      id: 2,
      title: "Combo B",
      description: "Combo of items C and D with a free drink.",
      price: "$25",
    },
  ],
  single: [
    {
      id: 1,
      title: "Single Item X",
      description: "Special single item X with a discount.",
      price: "$10",
    },
    {
      id: 2,
      title: "Single Item Y",
      description: "Exclusive single item Y with a free side.",
      price: "$15",
    },
  ],
};

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
        className="mt-1 flex items-center text-left w-full border border-gray-300 rounded-md p-2"
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

function OfferCard({ offer }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-lg font-semibold">{offer.itemname}</h2>
      <p className="text-gray-600">{offer.itemDscription}</p>
      <p className="font-bold text-green-600">{offer.price}</p>
    </div>
  );
}

function Offers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [alloffers, setalloffers] = useState([])
  const { user } = useAuth();
  const fetchOrders=async()=>{
    const res=await axios.post('/api/fetchDailyOffers',{
      resid:user.restaurantid
    })
    if(res.data.success){
      setalloffers(res.data.data);
    }
  }
  useEffect(()=>{
    fetchOrders();
  },[])

  const handleAddOffer = () => {
    setEditOffer(null); // Ensure we are adding a new offer, not editing
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditOffer(null);
    setIsModalOpen(false);
  };

  const handleOfferAdded = (newOffer) => {
    // Logic to add the new offer to state or send it to an API
    console.log("New offer added:", newOffer);
  };

  const handleEditOffer = (offer) => {
    setEditOffer(offer);
    setIsModalOpen(true);
  };

  return (
    <div className="relative p-6">
      <button
        onClick={handleAddOffer}
        className="fixed right-6 bottom-20 bg-orange-400 text-white rounded-full p-2 px-4 drop-shadow-lg border border-gray-300 text-3xl hover:scale-95 duration-300"
      >
        +
      </button>

      <div className="pt-4">
        <h1 className="text-2xl font-bold mb-6">Today's Offers</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Combo Offers</h2>
          {alloffers.length > 0 ? (
            alloffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))
          ) : (
            <p>No combo offers available.</p>
          )}
        </section>

        {/* <section>
          <h2 className="text-xl font-semibold mb-4">Single Offers</h2>
          {offers.single.length > 0 ? (
            offers.single.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))
          ) : (
            <p>No single offers available.</p>
          )}
        </section> */}
      </div>

      <OfferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOfferAdded={handleOfferAdded}
        offer={editOffer}
      />
    </div>
  );
}

export default Offers;

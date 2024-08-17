// Dummy data for offers

"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaEdit, FaTrash } from 'react-icons/fa';
import OfferModal from "./Components/AddOfferModal";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
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

// function OfferCard({ offer }) {
//   return (
//     <div className="border border-gray-300 rounded-lg p-4 shadow-md mb-4">
//       <h2 className="text-lg font-semibold">{offer.itemname}</h2>
//       <p className="text-gray-600">{offer.itemDescription}</p>
//       <p className="font-bold text-green-600">{offer.price}</p>
//     </div>
//   );
// }


function OfferCard({ offer, onEdit, onDelete }) {
  return (
    <div className="-z-20 border border-gray-300 rounded-lg p-3 shadow-md mb-3 bg-white flex items-center space-x-4">
      <img 
        src={offer.image} 
        alt={offer.itemname} 
        className="rounded-md w-32 h-32 object-cover" 
      />
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-800">{offer.itemname}</h2>
        <p className="text-md text-gray-600">{offer.itemDescription}</p>
          <p className="text-md mt-2 text-gray-500">Offer : {offer.offerName}</p>
          <p className="text-md  text-gray-500">Coupon : {offer.coupon}</p>
        <div className="flex justify-start space-x-4 items-center mt-2">
          <p className="line-through text-gray-400">₹{offer.oldPrice}</p>
          <p className="text-md font-semibold text-green-600">₹{offer.newPrice}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onEdit(offer)}
          className="text-blue-500 hover:text-blue-700 transition text-xl duration-150"
          aria-label="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(offer)}
          className="text-red-500 hover:text-red-700 text-xl transition duration-150"
          aria-label="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}



function Offers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [alloffers, setalloffers] = useState([])
  const { user } = useAuth();
  const fetchOffers=async()=>{
    const res=await axios.post('/api/fetchDailyOffers',{
      resid:user.restaurantid
    })
    if(res.data.success){
      setalloffers(res.data.data);
    }
  }
  useEffect(()=>{
    fetchOffers();
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
    //console.log("New offer added:", newOffer);
  };

  const handleEditOffer = (offer) => {
    setEditOffer(offer);
    setIsModalOpen(true);
  };

  const deleteOffer=async(offer)=>{
    try{
    if(confirm('Are you sure you want to delete this offer')){
      toast.loading('Deleting offer');
      const res=await axios.post('/api/deleteDailyOffers',{
        offerid:offer._id
      })
      toast.dismiss();
      if(res.data.success){
      toast.success("Order deleted successfully")
      fetchOffers();
      }
      else{
        toast.error("Failed to delete offer");
      }
      
    }
  }catch(e){
    toast.error("Failed to delete offer");
  }
  }

  return (
    <div className="relative py-4">
      <Toaster/>
      <button
        onClick={handleAddOffer}
        className="fixed right-6 bottom-20 bg-orange-400 text-white rounded-full p-2 px-4 drop-shadow-lg border border-gray-300 text-3xl hover:scale-95 duration-300"
      >
        +
      </button>

      <div className="pt-4">
        <h1 className="text-2xl font-bold mb-6">Today's Offers</h1>

        <section className="mb-20">
          {/* <h2 className="text-xl font-semibold mb-4">Combo Offers</h2> */}
          {alloffers.length > 0 ? (
            alloffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} onEdit={handleEditOffer} onDelete={deleteOffer}/>
            ))
          ) : (
            <p>No offers available.</p>
          )}
        </section>

      </div>

      <OfferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOfferAdded={handleOfferAdded}
        offers={editOffer}
        fetchOffers={fetchOffers}
      />
    </div>
  );
}

export default Offers;

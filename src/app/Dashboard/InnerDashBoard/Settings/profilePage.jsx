"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineTextsms } from "react-icons/md";
import avater from "../../../assets/images/avater.png";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import {toast,Toaster}  from 'react-hot-toast'

function ProfilePage() {
  // Simulated data
  const [resdetails, setresdetails] = useState({});
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [editableDetails, setEditableDetails] = useState({});
  
  const fetchresdetails = async (resid) => {
    console.log(resid.toString());
    
    try {
      const response = await axios.post(`/api/getrestaurantdetails`, {
        restaurantid: resid,
      });
      console.log(response.data);
      
      if (response.data.success) {
        setresdetails(response.data.data);
        setEditableDetails(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { user } = useAuth();
  
  useEffect(() => {
    console.log(user);
    
    fetchresdetails(user?.restaurantid);
  }, [user?.restaurantid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(`/api/updaterestaurantdetails`, {
        restaurantid: user?.restaurantid,
        ...editableDetails,
      });
      if (response.data.success) {
        setresdetails(editableDetails);
        setShowDetailsForm(false);
        toast.success("Details updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update details.");
    }
  };

  return (
    <div className="p-4">
      <Toaster/>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="flex-shrink-0 w-full lg:w-1/3 bg-zinc-50 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className="bg-zinc-200 rounded-full">
              <Image
                src={avater}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full s-full h-full"
              />
            </div>
            <p className="text-xl font-semibold text-zinc-800">
              {resdetails.restaurantname}
            </p>
            <p className="font-medium text-zinc-500 mb-2">
              hello! {user.name}
            </p>
          </div>
          <div className="border-t border-zinc-300 pt-4">
            <p className="text-lg font-semibold text-zinc-800">Address</p>
            <div className="mt-2">
              <p className="text-sm text-zinc-700">
                {resdetails.restaurantaddress}
              </p>
            </div>
          </div>
          <div className="border-t mt-2 border-zinc-300 pt-4 pb-2">
            <p className="text-lg font-semibold text-zinc-800">Opening Hours</p>
            <div className="mt-2">
              <p className="text-sm text-zinc-700">
                Opens At: {resdetails.restaurantopeninghours}
              </p>
              <p className="text-sm text-zinc-700">
                Closes At: {resdetails.restaurantclosinghours}
              </p>
            </div>
          </div>
          <div className="border-t mt-2 border-zinc-300 pt-4 pb-2">
            <p className="text-lg font-semibold text-zinc-800">Verification Status</p>
            <div className="mt-2">
              <p className="text-sm text-zinc-700">
                Status: {resdetails.verified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full lg:w-2/3">
          <div className="bg-white p-7 rounded-lg shadow-lg">
            <div className="flex justify-start space-x-4 items-center mb-5">
              
              <div 
                className="text-xl underline underline-offset-4 font-semibold text-zinc-700 cursor-pointer"
                onClick={() => setShowDetailsForm(true)}
              >
                Details
              </div>
            </div>
            <div className="border-b border-zinc-300 mb-4"></div>
            
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="address"
                  >
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="restaurantaddress"
                    value={editableDetails.restaurantaddress || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="opening-hours"
                  >
                    Opening Hours:
                  </label>
                  <input
                    type="time"
                    id="opening-hours"
                    name="restaurantopeninghours"
                    value={editableDetails.restaurantopeninghours || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="closing-hours"
                  >
                    Closing Hours:
                  </label>
                  <input
                    type="time"
                    id="closing-hours"
                    name="restaurantclosinghours"
                    value={editableDetails.restaurantclosinghours || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="noofchefs"
                  >
                    Number of Chefs:
                  </label>
                  <input
                    type="text"
                    id="noofchefs"
                    name="noofchefs"
                    value={editableDetails.noofchef || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="noofemployees"
                  >
                    Number of Employees:
                  </label>
                  <input
                    type="text"
                    id="noofemployees"
                    name="noofemployees"
                    value={editableDetails.noofemployees || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="nooftables"
                  >
                    Number of Tables:
                  </label>
                  <input
                    type="text"
                    id="nooftables"
                    name="nooftables"
                    value={editableDetails.nooftables || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="noofwaiters"
                  >
                    Number of Waiters:
                  </label>
                  <input
                    type="text"
                    id="noofwaiters"
                    name="noofwaiters"
                    value={editableDetails.noofwaiters || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-zinc-700 text-sm font-bold mb-2"
                    htmlFor="noofseatingcapacity"
                  >
                    Seating Capacity:
                  </label>
                  <input
                    type="text"
                    id="noofseatingcapacity"
                    name="noofseatingcapacity"
                    value={editableDetails.noofseatingcapacity || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-zinc-700 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-orange-500 hover:bg-orange-400  px-6 py-2 rounded-lg flex items-center text-white hover:drop-shadow-lg transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

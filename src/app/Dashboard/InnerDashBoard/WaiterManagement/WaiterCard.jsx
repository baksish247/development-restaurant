"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import avater from '../../../assets/images/avater.png';
import Switch from './Switch';
import { RiArrowDropRightLine, RiCloseCircleLine } from 'react-icons/ri';
import { CiEdit } from "react-icons/ci";
import axios from 'axios';

function WaiterCard({ item, handleSwitchChange }) {
  const [isChecked, setIsChecked] = useState(item?.ispresent ?? false);
  const [showDetails, setShowDetails] = useState(false);
  const [waiterDetails, setWaiterDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (confirm(`Mark Waiter as ${isChecked ? "absent" : "present"}`)) {
      const newState = !isChecked;
      setIsChecked(newState);
      await handleSwitchChange(item._id, newState); // Pass the id and new state to the handler
    }
  };

  const handleDetailsClick = async () => {
    setShowDetails(!showDetails);
    if (!waiterDetails && !showDetails) {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/fetchwaiterbyid`, { waiterid: item._id });
        if (data.success) {
          setWaiterDetails(data.data);
        } else {
          console.error("Failed to fetch waiter details:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while fetching waiter details:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`${isChecked ? 'bg-white' : 'bg-zinc-200/70'} shadow-md  shadow-black/20 border w-[95%] mx-auto p-4 rounded-lg`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={item?.image ?? avater}
            height={100}
            width={100}
            className="h-16 w-16 object-cover object-top rounded-full"
            alt="profileimg"
          />
          <div>
            <p className="font-bold">{item?.username}</p>
            <p>Current Assigned Table: 1</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch isChecked={isChecked} handleChange={handleChange} />
          <button
            className="flex items-center text-zinc-800 hover:underline cursor-pointer"
            onClick={handleDetailsClick}
          >
            <span>{showDetails ? "Hide Details" : "See Details"}</span>
            {showDetails ? <RiCloseCircleLine className="text-xl" /> : <RiArrowDropRightLine className="text-xl" />}
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center">
              <span className="loader"></span>
            </div>
          ) : (
            waiterDetails && (
              <>
                {/* <h3 className="text-lg font-bold mb-2">Waiter Details</h3> */}
                <div className="flex text-zinc-800 hover:text-white transition-colors duration-300 ml-auto items-center px-4 rounded-lg bg-white hover:bg-orange-500 cursor-pointer border border-orange-700 drop-shadow-md py-1 w-fit justify-end">
                  <CiEdit />
                  &nbsp;Edit
                </div>
                <div className="md:grid md:grid-cols-2 justify-items-stretch">
                <p><strong>Name:</strong> {waiterDetails.username}</p>
                <p><strong>Email:</strong> {waiterDetails.email}</p>
                <p><strong>Phone:</strong> {waiterDetails.phone}</p>
                <p><strong>Assigned Tables:</strong> {waiterDetails?.assignedTables?.join(', ')}</p>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default WaiterCard;

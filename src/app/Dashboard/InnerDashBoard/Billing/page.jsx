"use client";
import React, { useEffect, useState } from "react";
import Leftsection from "./Leftsection";
import BillviewSection from "./BillviewSection";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderindex, setorderindex] = useState(null);
  const [restaurantinfo, setrestaurantinfo] = useState({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const setordertobill = (index) => {
    setorderindex(index);
    setIsPanelOpen(true); // Open the side panel when an order is selected
    //console.log(orders[index]);
  };
  const fetchorders = async (resid) => {
    const { data } = await axios.post("/api/fetchallordersbyid", {
      restaurant_id: resid,
    });
    setOrders(data?.data || []);
    setLoading(false);
  };

  const fetchAllOrders = async (resid) => {
    try {
      const res_details = await axios.post("/api/getrestaurantdetails", {
        restaurantid: resid,
      });
      if (res_details.data.success) {
        //console.log(res_details.data.data);
        setrestaurantinfo({
          cgst: res_details.data.data.cgst,
          sgst: res_details.data.data.sgst,
          restaurantid: resid,
          restaurantname: res_details.data.data.restaurantname,
          restaurantphoneNo: res_details.data.data.restaurantphoneNo,
          restaurantaddress: res_details.data.data.restaurantaddress,
        });
        const { data } = await axios.post("/api/fetchallordersbyid", {
          restaurant_id: resid,
        });
        setOrders(data?.data || []);
        setLoading(false); // Set loading to false once data is received
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false); // Ensure loading is false even if there's an error
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const resid = localStorage.getItem("restaurantid");
      if (resid) {
        fetchAllOrders(resid);
      }
    }, 100000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  
  useEffect(() => {
    const resid = localStorage.getItem("restaurantid");
    if (resid) {
      fetchAllOrders(resid);
    } else {
      setLoading(false); // If no restaurant id, set loading to false
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh]">
      <div className="px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-10">
        <div className="lg:col-span-5 flex flex-col">
          <Leftsection fetchorders={fetchorders} orders={orders} setordertobill={setordertobill} />
        </div>
        <div className="hidden lg:flex justify-center items-center lg:col-span-1">
          <div className="h-[460px] w-[2px] bg-slate-700/30" />
        </div>
        <div className="hidden lg:flex lg:col-span-5 flex-col">
          <BillviewSection
            key={orderindex}
            orders={orders}
            orderindex={orderindex}
            restaurantinfo={restaurantinfo}
            fetchorder={fetchAllOrders}
          />
        </div>
      </div>

      {/* Side panel for small screens */}
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 lg:hidden">
          <div className="bg-white w-3/4 h-full shadow-lg p-4 relative">
            <button
              onClick={() => setIsPanelOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <BillviewSection
              key={orderindex}
              orders={orders}
              orderindex={orderindex}
              restaurantinfo={restaurantinfo}
              fetchorder={fetchAllOrders}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;

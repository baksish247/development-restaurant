"use client";
import React, { useEffect, useState } from "react";
import Leftsection from "./Leftsection";
import BillviewSection from "./BillviewSection";
import axios from "axios";

function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const setordertobill = (index) => {
    setOrder(orders[index]);
  };

  const fetchAllOrders = async (resid) => {
    try {
      const { data } = await axios.post("/api/fetchallordersbyid", {
        restaurant_id: resid,
      });
      setOrders(data?.data || []);
      setLoading(false); // Set loading to false once data is received
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false); // Ensure loading is false even if there's an error
    }
  };

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
    <div className="px-10 grid grid-cols-11 gap-10 min-h-[70vh]">
      <div className="col-span-5 flex flex-col ">
        <Leftsection orders={orders} setordertobill={setordertobill} />
      </div>
      <div className="flex justify-center items-center col-span-1">
        <div className="h-[460px] w-[2px] bg-slate-700/30" />
      </div>
      <div className="col-span-5 flex flex-col ">
        <BillviewSection key={order} order={order} />
      </div>
    </div>
  );
}

export default Page;

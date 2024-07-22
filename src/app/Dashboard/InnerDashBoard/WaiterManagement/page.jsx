"use client";
import React, { useEffect, useState } from "react";
import WaiterCard from "./WaiterCard";
import axios from "axios";

function Page() {
  const [waiters, setWaiters] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const handleSwitchChange = async(id, newState) => {
    try {
      const { data } = await axios.post("/api/waiterattendance", { waiterId: id, ispresent: newState });
      if (data.success) {
        setWaiters((prevWaiters) =>
          prevWaiters.map((waiter) =>
            waiter._id === id ? { ...waiter, ispresent: newState } : waiter
          )
        );
      } else {
        console.error("Failed to update waiter status:", data.error);
      }
    } catch (error) {
      console.error("Error occurred while updating waiter status:", error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchWaiters = async () => {
      const restaurant_id = localStorage.getItem("restaurantid");
      try {
        const { data } = await axios.post("/api/getwaiters", { restaurant_id });
        if (data.success) {
          setWaiters(data.data);
        } else {
          console.error("Failed to fetch waiters:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while fetching waiters:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchWaiters();
    }
  }, []);

  const filteredWaiters = waiters.filter((waiter) => {
    if (filter === "present") {
      return waiter.ispresent;
    } else if (filter === "absent") {
      return !waiter.ispresent;
    }
    return true;
  });

  return (
    <div className="flex-1 space-y-4 mt-4 noscrollbar">
      <div className="flex justify-center mb-4">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-40">
          <span className="loader"></span>
        </div>
      ) : filteredWaiters.length > 0 ? (
        filteredWaiters.map((item) => (
          <WaiterCard
            key={item._id}
            item={item}
            handleSwitchChange={handleSwitchChange}
          />
        ))
      ) : (
        <div className="flex justify-center items-center mt-40">
          <span>No Waiters found</span>
        </div>
      )}
    </div>
  );
}

export default Page;

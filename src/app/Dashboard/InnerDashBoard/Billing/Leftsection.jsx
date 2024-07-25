"use client";
import React from "react";
import TableCards from "./TableCard";

function Leftsection({ orders, setordertobill }) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl">Orders</h1>
        <button className="bg-[#441029] hover:bg-[#631543] transition-colors duration-200 drop-shadow text-white px-4 py-2 rounded">
          Create an order
        </button>
      </div>
      <div className="space-y-2 max-h-[500px] pb-4 overflow-auto justify-items-center items-center mt-4">
        {orders?.length>0 ? (
          orders.map((item, i) => (
            <TableCards
              setordertobill={setordertobill}
              index={i}
              item={item}
              key={i}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center text-3xl mt-20">No orders yet....</div>
        )}
      </div>
    </div>
  );
}

export default Leftsection;

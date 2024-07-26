"use client";
import React, { useState } from "react";
import TableCards from "./TableCard";
import CreateOrderModle from "./CreateNewOrder/CreateOrderModle";

function Leftsection({ orders, setordertobill }) {
  const [opencreateorderflag, setopencreateorderflag] = useState(false)
  const OpenCreateOrderMoodle =()=>{
    // Open Create Order modal
    setopencreateorderflag(true);
  }
  const CloseCreateOrderMoodle =()=>{
    // Open Create Order modal
    setopencreateorderflag(false);
  }
  
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl">Orders</h1>
        <button onClick={OpenCreateOrderMoodle} className="bg-[#441029] hover:bg-[#631543] transition-colors duration-200 drop-shadow text-white px-4 py-2 rounded">
          Create an order
        </button>
      </div>
      <div className="space-y-2 max-h-[500px] pb-4 overflow-auto justify-items-center items-center mt-4">
        {orders?.length ? (
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
      {opencreateorderflag && <CreateOrderModle onClose={CloseCreateOrderMoodle} openflag={opencreateorderflag}/>}
    </div>
  );
}

export default Leftsection;

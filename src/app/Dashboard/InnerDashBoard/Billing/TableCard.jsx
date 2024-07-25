"use client";
import React from "react";

function TableCard({ setordertobill, item, index }) {
  return (
    <div onClick={()=>setordertobill(index)} className="h-fit min-h-20 space-y-1 w-full p-3 rounded  bg-white drop-shadow ">
      <div className="flex justify-between items-center font-medium">
        <span>
          Table <span>{item?.table_number}</span>
        </span>
        <span className="rounded-full bg-green-400 p-1 px-4 text-sm text-white">
          Active
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div>
        <span className="font-medium">Waiter Alloted : </span>
        <span>{item?.waiter_name}</span>
        {!item?.waiter_name && <span>No waiter alloted</span>}
        </div>
        {!item?.waiter_name && <span className="border border-red-700 animate-ping duration-10000 h-2 w-2 mr-2 rounded-full bg-red-700"></span>}
      </div>
      <div>
        <span className="font-medium">Ordered At : </span>
        <span>{new Date(item?.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default TableCard;

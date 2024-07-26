"use client";
import React from "react";

function TableCard({ setordertobill, item, index }) {
  return (
    <div
      onClick={() => setordertobill(index)}
      className="h-fit min-h-20 space-y-1 w-full p-4 rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center font-semibold">
        <span>
          Table <span>{item?.table_number}</span>
        </span>
        <span className="rounded-full bg-green-500 py-1 px-3 text-sm text-white">
          Active
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div>
          <span className="font-semibold">Waiter Alloted: </span>
          <span>{item?.waiter_name || "No waiter alloted"}</span>
        </div>
        {!item?.waiter_name && (
          <span className="border border-red-700 animate-ping duration-10000 h-2 w-2 mr-2 rounded-full bg-red-700"></span>
        )}
      </div>
      <div className="mt-1">
        <span className="font-semibold">Ordered At: </span>
        <span>{new Date(item?.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default TableCard;

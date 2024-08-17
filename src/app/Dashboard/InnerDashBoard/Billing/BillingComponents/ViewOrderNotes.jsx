import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

function ViewOrderNotes({ onClose, order }) {

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <Toaster />
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-[#440129] p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>

          <h2 className="text-lg text-center font-semibold py-1">
            View Order Notes
          </h2>
          <hr className="mb-4 mt-1 border-[0.1px] border-black" />
          <div className="flex flex-col space-y-2">
            <div className="flex justify-start space-x-2">
              <span className="font-semibold">Table Number:</span>
              <span>{order.table_number}</span>
            </div>
            <div className="flex justify-start items-center space-x-2 ">
              <span className="font-semibold text-sm">Order ID:</span>
              <span className="text-[0.7rem]">{order.order_id}</span>
            </div>
            <div className="flex justify-start space-x-2">
              <span className="font-semibold">Customer Name:</span>
              <span>{order?.customer_name ? order?.customer_name : ""}</span>
            </div>
            <div className="flex justify-start space-x-2">
              <span className="font-semibold">Customer Phone:</span>
              <span>{order?.customer_phone ? order?.customer_phone : ""}</span>
            </div>
          </div>
          <div className="flex mt-2 justify-start ">
            <span className="font-semibold">Status:</span>
            <span>
              <div className="text-black py-0 px-2">
                {order.order_status === "new"
                  ? "New Order"
                  : order.order_status === "waitingforbill"
                  ? "Waiting for bill"
                  : order.order_status === "updated"
                  ? "Updated Order"
                  : order.order_status === "served"
                  ? "Served"
                  : order.order_status === "billgenerated"
                  ? "Bill Generated"
                  : "No status"}
              </div>
            </span>
          </div>
          <hr className="border-[1px] border-dotted border-black my-4" />
          <div className="font-semibold mb-3">Order Items:</div>
          <div className="flex flex-col">
            {order.order_items.map((orderitems, j) => (
              <span key={j} className="mb-3">
                {orderitems.items.map((item, k) => (
                  <div key={k} className={`flex justify-between `}>
                    <span className="capitalize">{item.food.name}</span>
                    <span className="text-base h-full pt-1 text-center w-1/3 text-black">
                      x {item.quantity}
                    </span>{" "}
                  </div>
                ))}
                <div className="mt-2 border-b border-black border-dashed pb-2">
                  {orderitems.notes && <textarea
                    name="notes"
                    value={orderitems.notes}
                    readOnly={true}
                    className="w-full p-2 border-2 border-amber-500 rounded-lg shadow-lg text-sm"
                    placeholder="Notes from customer to be kept here that will be conveyed to chef"
                  />}
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrderNotes;

"use client";
import React, { useState } from "react";
import EditOrderModal from "./BillingComponents/EditOrderModal";
import GenerateBillModal from "./BillingComponents/GenerateBillModal";
import MakeOrderPaid from "./BillingComponents/MakeOrderPaid";

function BillviewSection({ orders, orderindex ,restaurantinfo,fetchorder}) {
  // Check if order is an empty object or undefined

  const order=orders[orderindex];
  console.log(restaurantinfo)
  console.log(order)
  const isOrderEmpty = !order || Object.keys(order).length === 0;
  const [openeditModal, setopeneditModal] = useState(false);
  const closeEditModal=()=>{
    setopeneditModal(false);
  }
  const [openGenerateBillModal, setopenGenerateBillModal] = useState(false);
  const closeGenerateBillModal=()=>{
    setopenGenerateBillModal(false);
  }

  const [openPaidModal, setopenPaidModal] = useState(false);
  const closePaidModal=()=>{
    setopenPaidModal(false);
  }
  

  return (
    <div className="pt-4">
      {isOrderEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-100 p-6 rounded-lg shadow-lg">
          <span className="text-xl font-semibold text-gray-800 mb-4">
            No order selected
          </span>
          <p className="text-gray-600 mb-6">
            Please select a table to view and manage the bill.
          </p>
          
        </div>
      ) : (
        <>
          <div className="ml-auto w-56 px-4 py-3 bg-zinc-200 rounded">
            Order Amount: ₹ {order?.initial_bill}
          </div>

          <div className="relative pt-3">
            <div className="top-0 sticky flex justify-between px-2">
              <span className="underline underline-offset-3">
                Table No: {order?.table_number}
              </span>
              <span className="text-red-500 hover:underline cursor-pointer"
              onClick={()=>setopeneditModal(true)}>
                Edit Order
              </span>
            </div>

            <div className="space-y-2 border gap-2 pt-4 h-[350px] m-2 p-2 overflow-auto">
              {order?.order_items?.map((orderItem, i) =>
                orderItem.items.map((item, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="bg-zinc-200 min-h-10 h-fit w-full rounded p-3 flex justify-between items-center"
                  >
                    <span>{item.food.name}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ₹ {item.food.price}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="buttons mx-2 mt-3 flex flex-col items-center space-y-4">
          <button onClick={()=>{setopenPaidModal(true)}} 
            className="bg-emerald-500 w-full hover:bg-green-500 transition-colors duration-200 text-white font-regular tracking-widest py-3 px-4 rounded focus:outline-none focus:shadow-outline">
              Mark as Paid
            </button>
            <button onClick={()=>{setopenGenerateBillModal(true)}} 
            className="bg-[#441029] hover:bg-fuchsia-950 transition-colors duration-500 w-full text-white font-regular tracking-widest py-3 px-4 rounded focus:outline-none focus:shadow-outline">
              Proceed to Bill
            </button>
          </div>
        </>
      )}
      {openPaidModal && <MakeOrderPaid order={order} onClose={closePaidModal} fetchorder={fetchorder} restaurantinfo={restaurantinfo}/>}
      {openeditModal && <EditOrderModal onClose={closeEditModal} order={order} restaurantinfo={restaurantinfo} fetchorder={fetchorder}/>}
      {openGenerateBillModal && <GenerateBillModal onClose={closeGenerateBillModal} selectedOrder={order} restaurantinfo={restaurantinfo}/>}
    </div>
  );
}

export default BillviewSection;

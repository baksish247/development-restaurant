"use client";
import React, { useState } from "react";
import EditOrderModal from "./BillingComponents/EditOrderModal";
import GenerateBillModal from "./BillingComponents/GenerateBillModal";
import MakeOrderPaid from "./BillingComponents/MakeOrderPaid";
import { FiUpload } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import ViewOrderNotes from "./BillingComponents/ViewOrderNotes";

function BillviewSection({ orders, orderindex, restaurantinfo, fetchorder }) {
  const [estimatedtime, setestimatedtime] = useState("");

  // Check if order is an empty object or undefined

  const order = orders[orderindex];

  // console.log(restaurantinfo);
  // console.log(order);
  const isOrderEmpty = !order || Object.keys(order).length === 0;
  const [openeditModal, setopeneditModal] = useState(false);
  const closeEditModal = () => {
    setopeneditModal(false);
  };
  const [openGenerateBillModal, setopenGenerateBillModal] = useState(false);
  const closeGenerateBillModal = () => {
    setopenGenerateBillModal(false);
  };

  const [openPaidModal, setopenPaidModal] = useState(false);
  const closePaidModal = () => {
    setopenPaidModal(false);
  };

  const [openviewOrderNotesModal, setopenviewOrderNotesModal] = useState(false);
  const closeviewOrderNotesModal=()=>{
    setopenviewOrderNotesModal(false);
  }
  const markserved = async () => {
    try {
      const res = await axios.post("/api/markasserved", {
        order_id: order.order_id,
      });
      if (res.data.success) {
        alert("Order marked as served successfully");
      }
    } catch (err) {
      alert("Failed to mark order as served");
    } finally {
      fetchorder(restaurantinfo.restaurantid);
    }
  };

  const updateestimatedtime = async () => {
    try {
      const orderestimate_time =
        order.estimated_time_to_serve == undefined
          ? new Date()
          : new Date(order.estimated_time_to_serve);
      const currentTime = new Date();
      const newTime = new Date(
        currentTime.getTime() + parseInt(estimatedtime) * 60000
      );
      const res = await axios.post("/api/updateestimatetime", {
        order_id: order.order_id,
        estimated_time:
          newTime.getTime() > orderestimate_time.getTime()
            ? newTime
            : orderestimate_time,
      });
      if (res.data.success) {
        toast("Wait time updated successfully.");
      } else {
        alert(res.data.error);
      }
    } catch (e) {
      alert("Failed to update wait time.");
    } finally {
      setestimatedtime("");
      fetchorder(restaurantinfo.restaurantid);
    }
  };

  return (
    <div>
      <Toaster />
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
            <div className="md:flex md:items-center md:justify-between">
              <div className="w-fit px-4 py-3 flex items-center justify-center">
                Wait Time (mins):{" "}
                <input
                  type="text"
                  value={estimatedtime}
                  onChange={(e) => setestimatedtime(e.target.value)}
                  className="h-8 ml-1 w-12 px-2  bg-white drop-shadow-md rounded"
                />
                <button
                  type="button"
                  disabled={estimatedtime.length == 0}
                  className="ml-3 text-2xl bg-orange-400 text-white p-1 rounded-md  disabled:bg-orange-300 disabled:cursor-not-allowed"
                  onClick={updateestimatedtime}
                >
                  <FiUpload className="" />
                </button>
              </div>
              <div className="ml-auto w-fit px-4 py-3 bg-white drop-shadow-md rounded">
                Order Amount: ₹{" "}
                {parseFloat(order?.initial_bill)?.toFixed(2) ?? 0}
              </div>
            </div>
            <div className="relative pt-3">
              <div className="top-0 sticky flex justify-between px-2">
                <span className="underline underline-offset-3">
                  Table No: {order?.table_number}
                </span>
                <span
                  className="text-orange-500 hover:underline cursor-pointer"
                  onClick={() => setopeneditModal(true)}
                >
                  Edit Order
                </span>
              </div>
              <div className="mt-3 sticky flex items-center justify-between px-2">
                <span>
                  <div>Name : {order?.customer_name?order?.customer_name:""}</div>
                  <div>Phone : {order?.customer_phone?order?.customer_phone:""}</div>
                </span>
                <span className="text-white bg-orange-500 px-3 py-1 rounded-md cursor-pointer"
                  onClick={() => setopenviewOrderNotesModal(true)}>
                    View order notes
                </span>
              </div>
              <div className="space-y-2 border gap-2 pt-4 h-[350px] m-2 p-2 overflow-auto">
                {order?.order_items?.map((orderItem, i) =>
                  orderItem.items.map((item, j) => {
                    return (
                      <div
                        key={`${i}-${j}`}
                        className="bg-white drop-shadow-md min-h-10 h-fit w-full rounded p-3 grid grid-cols-4 items-center"
                      >
                        <span className="col-span-2 capitalize">
                          {item.food?.name}
                        </span>
                        <span>Qty: {item?.quantity}</span>
                        <span className="text-right">
                          {" "}
                          ₹{" "}
                          {(
                            parseFloat(item?.food?.price) *
                            parseFloat(item?.quantity)
                          ).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {(order.order_status == "new" ||
              order.order_status == "updated") && (
              <div className="relative">
                <button
                  type="button"
                  onClick={markserved}
                  className="absolute right-3 bg-green-400 flex items-center justify-center px-5 py-1 rounded-md"
                >
                  <span>
                    <TiTick />
                  </span>
                  &nbsp;Mark as Served
                </button>
              </div>
            )}
            <div className="buttons mx-2 mb-8 mt-12 flex flex-col items-center space-y-4">
              <button
                onClick={() => {
                  setopenPaidModal(true);
                }}
                className="bg-amber-500 w-full hover:bg-amber-400 transition-colors duration-200 text-white font-regular tracking-widest py-3 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => {
                  setopenGenerateBillModal(true);
                }}
                className="bg-orange-500 hover:bg-orange-400 transition-colors duration-500 w-full text-white font-regular tracking-widest py-3 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Proceed to Bill
              </button>
            </div>
          </>
        )}
        {openPaidModal && (
          <MakeOrderPaid
            order={order}
            onClose={closePaidModal}
            fetchorder={fetchorder}
            restaurantinfo={restaurantinfo}
          />
        )}
        {openeditModal && (
          <EditOrderModal
            onClose={closeEditModal}
            order={order}
            restaurantinfo={restaurantinfo}
            fetchorder={fetchorder}
          />
        )}
        {openGenerateBillModal && (
          <GenerateBillModal
            onClose={closeGenerateBillModal}
            selectedOrder={order}
            restaurantinfo={restaurantinfo}
          />
        )}
        {openviewOrderNotesModal && (
          <ViewOrderNotes
            onClose={closeviewOrderNotesModal}
            order={order}
          />
        )}
      </div>
    </div>
  );
}

export default BillviewSection;

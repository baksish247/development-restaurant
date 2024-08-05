"use client";
import React, { useState } from "react";
import TimeAgo from "react-timeago";
import ViewOrder from "./ViewOrderModal";
import ReserveTableModal from "./ReserveTable";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function TableCard({
  table,
  nooftables,
  cgst,
  sgst,
  restaurantid,
  restaurantname,
  restaurantphoneNo,
  restaurantaddress,
  fetchorder,
}) {
  const restaurantinfo = {
    nooftables: nooftables,
    cgst: cgst,
    sgst: sgst,
    restaurantid: restaurantid,
    restaurantname: restaurantname,
    restaurantphoneNo: restaurantphoneNo,
    restaurantaddress: restaurantaddress,
  };
  const [openViewModal, setopenViewModal] = useState(false);
  const [selectedOrder, setselectedOrder] = useState(null);
  const [reservetable, setreservetable] = useState(false)

  const closereservetable=()=>{
    setreservetable(false);
    setopenViewModal(false)
  }

  const openViewOrderModal = () => {
    setopenViewModal(true);
    setselectedOrder(table.orderdetails[0]);
    console.log(table.orderdetails[0]);
  };

  const closeViewOrderModal = () => {
    setopenViewModal(false);
    setselectedOrder(null);
  };

  const markunreserve=async()=>{
    if(confirm('Are you sure you want to mark this as unreserved?')){
    toast.loading("Marking as unreserved");
    const res=await axios.post("/api/reservetable",{table_number:table.number,restaurant_id: restaurantid,reserve:false})
    console.log(res.data);
    if(res.data.success){
      toast.dismiss();
      toast.success("Marked as unreserved");
      fetchorder();
    }else{
      toast.dismiss();
      toast.error("Failed to mark as unreserved");
    }
  }
  }
  return (
    <div>
      <Toaster/>
      <div
        onClick={openViewOrderModal}
        className={` border-2 rounded-lg h-28 w-44 ${
          table.orderdetails[0]?.order_status == "updated"
            ? "bg-amber-100 border-amber-500 border-dashed"
            : table.orderdetails[0]?.order_status == "new"
            ? "bg-green-200 border-green-500 border-dashed"
            : table.orderdetails[0]?.order_status == "served"
            ? "bg-sky-200 border-sky-500 border-dashed"
            : table.orderdetails[0]?.order_status == "waitingforbill"
            ? "bg-red-200 border-red-500 border-dashed"
            : table.orderdetails[0]?.order_status == "billgenerated"
            ? "bg-gray-200 border-gray-500 border-dashed"
            : "bg-white border-slate-300 "
        }   relative flex flex-col cursor-pointer`}
      >
        <div
          className={`flex-none border-b-2 ${
            table.orderdetails[0]?.order_status == "updated"
              ? " border-amber-500/50 "
              : table.orderdetails[0]?.order_status == "new"
              ? " border-green-500/50 "
              : table.orderdetails[0]?.order_status == "served"
              ? " border-sky-500/50 "
              : table.orderdetails[0]?.order_status == "waitingforbill"
              ? " border-red-500/50 "
              : table.orderdetails[0]?.order_status == "billgenerated"
              ? " border-gray-500/50 "
              : "bg-white border-slate-300 "
          }  rounded-t-lg h-6 bg-white flex items-center justify-center`}
        >
          <span className="text-zinc-800">{table.number}</span>
        </div>
        {table.orderdetails.order_status != "empty" && table.orderdetails.order_status != "reserved" &&(
          <div className="flex-1 px-2">
            <div className="absolute bottom-4 left-4 space-y-1">
              <p className="text-[0.7rem]">
                Ordered : <TimeAgo date={table.orderdetails[0].createdAt} />
              </p>
              <p className="text-[0.7rem]">
                Status :&nbsp;
                {table.orderdetails[0].order_status === "updated"
                  ? "Recently updated"
                  : table.orderdetails[0].order_status == "new"
                  ? "New order"
                  : table.orderdetails[0].order_status == "served"
                  ? "Served"
                  : table.orderdetails[0].order_status == "waitingforbill"
                  ? "Waiting for bill"
                  : table.orderdetails[0].order_status == "billgenerated"
                  ? "Bill generated"
                  : "in progress"}
              </p>
              <p className="text-[0.7rem]">
                Bill : ₹{table.orderdetails[0].total_bill}
              </p>
            </div>
          </div>
        )}
        {table.orderdetails.order_status == "empty" && (
          <div onClick={()=>setreservetable(true)} 
          className="mx-auto my-auto px-4 py-1  rounded-md text-sm border-gray-300 shadow-inner shadow-gray-300 border-2">Reserve table</div>
        )}
        {table.orderdetails.order_status == "reserved" && (<div>
          <div className="mx-auto my-auto text-center font-medium mt-2 rounded-md text-sm text-orange-500">Reserved for guest</div>
          <div onClick={()=>{setopenViewModal(false);markunreserve()}} className="mx-3 text-center mt-4  rounded-md text-sm border-gray-300 shadow-inner shadow-gray-300 border-2">Mark as unreserved</div>
          </div>
        )}
      </div>
      {openViewModal && table.orderdetails.order_status != "empty" && table.orderdetails.order_status != "reserved" &&(
        <ViewOrder
          onClose={closeViewOrderModal}
          selectedOrder={selectedOrder}
          restaurantinfo={restaurantinfo}
          fetchorder={fetchorder}
        />
      )}
      {reservetable && (<ReserveTableModal onClose={closereservetable} fetchorder={fetchorder} table_number={table.number} restaurantid={restaurantid}/>)}
    </div>
  );
}

export default TableCard;

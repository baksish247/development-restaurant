import React from "react";
import TimeAgo from "react-timeago";
function TableCard({ table }) {
  console.log(table.orderdetails);
  return (
    <div
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
      }   relative flex flex-col`}
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
      {table.orderdetails.order_status != "empty" && (
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
    </div>
  );
}

export default TableCard;

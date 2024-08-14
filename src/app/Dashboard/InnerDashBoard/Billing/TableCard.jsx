"use client";
import React from "react";
import Countdown from "react-countdown";

function TableCard({ setordertobill, item, index }) {
  const waitingtime=item.estimated_time_to_serve;
  const renderer = ({ hours, minutes, seconds, completed }) => {
    // return(<div>ghjk</div>)
    if (
      item.order_status == "new" ||
      item.order_status == "updated"
    ) {
      if (completed) {
        console.log(hours, minutes, seconds)
        return (
            <div className="text-center text-red-600">Customer waiting</div>
        );
      } else {
        console.log(hours, minutes, seconds)
        return (
          <div className="text-red-700">
                {parseInt(hours) != 0 ? hours : ""}
                {minutes} : {seconds}
               &nbsp;mins
          </div>
        );
      }
    }
  };
  return (
    <div
      onClick={() => setordertobill(index)}
      className="h-fit min-h-20 space-y-1 w-full p-4 rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center font-semibold">
        <span>
          Table <span>{item?.table_number}</span>
        </span>
        <span>{waitingtime && (
              <Countdown date={new Date(waitingtime)} renderer={renderer} />
            )}</span>
        <span className={`rounded-full  py-1 px-3 text-sm text-white ${
                          item?.order_status == "updated"
                            ? "bg-[#dbc81a]"
                            : item?.order_status == "new"
                            ? "bg-[#0ace55]"
                            : item?.order_status == "served"
                            ? "bg-[#1c4dae]"
                            : item?.order_status == "waitingforbill"
                            ? "bg-[#c42b2b]"
                            : item?.order_status == "billgenerated"
                            ? "bg-gray-600"
                            : "bg-[#584545]"
                        }`}>
          {item?.order_status === "updated"
                        ? "Recently updated"
                        : item?.order_status == "new"
                        ? "New order"
                        : item?.order_status == "served"
                        ? "Served"
                        : item?.order_status == "waitingforbill"
                        ? "Waiting for bill"
                        : item?.order_status == "billgenerated"
                        ? "Bill generated"
                        : "in progress"}
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

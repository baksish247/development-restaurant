import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { HiDotsVertical } from "react-icons/hi";
import { TbArrowBigRightLines } from "react-icons/tb";
import ViewOrderDetailsModal from "./ViewOrderDetailsModal";

function BillingHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filterType, setFilterType] = useState("today");
  const [revenue, setrevenue] = useState("");
  const [viewordermodal, setviewordermodal] = useState(false)
  const [vieworder, setvieworder] = useState({})

  const closeviewordermodal=()=>{
    setviewordermodal(false)
    setvieworder({})
  }
  const fetchAllOrders = async () => {
    try {
      const res = await axios.post("/api/fetchcompletedorders", {
        restaurant_id: user.restaurantid,
      });
      setOrders(res.data.data);
      filterOrdersByDate(dayjs().format("YYYY-MM-DD"), res.data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filterOrdersByDate = (date, ordersList = orders) => {
    let amount = 0;
    const filtered = ordersList?.filter((order) => {
      const orderDate = dayjs(order.updatedAt).format("YYYY-MM-DD");
      if (orderDate == date) {
        amount += parseFloat(order.total_bill);
      }
      return orderDate === date;
    });
    setrevenue(amount);
    setFilteredOrders(filtered);
    setFilterDate(date);
  };

  const filterOrdersByRange = (days) => {
    let amount = 0;
    const startDate = dayjs().subtract(days, "days");
    const filtered = orders?.filter((order) => {
      const orderDate = dayjs(order.updatedAt);
      if (orderDate.isAfter(startDate)) {
        amount += parseFloat(order.total_bill);
      }
      return orderDate.isAfter(startDate);
    });
    setrevenue(amount);
    setFilteredOrders(filtered);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);
    filterOrdersByDate(selectedDate);
  };

  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    if (type === "today") {
      filterOrdersByDate(dayjs().format("YYYY-MM-DD"));
    } else if (type === "yesterday") {
      filterOrdersByDate(dayjs().subtract(1, "day").format("YYYY-MM-DD"));
    } else if (type === "last7days") {
      filterOrdersByRange(7);
    } else if (type === "last30days") {
      filterOrdersByRange(30);
    } else {
      setFilteredOrders(orders);
    }
  };

  return (
    <div>
      <div className=" flex justify-between items-center mt-4">
        <div className=" flex space-x-4 drop-shadow-md">
          <div>
            <label className="font-semibold mb-2">Filter by:</label>
            <select
              value={filterType}
              onChange={handleFilterTypeChange}
              className="border-2 border-black rounded-md p-2 ml-2"
            >
              <option value="date">Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
          </div>
          {filterType === "date" && (
            <div>
              <label className="font-semibold mb-2">Select Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="border-2 border-black rounded-md p-2 ml-2"
              />
            </div>
          )}
        </div>
        <div className="flex drop-shadow-md ">
          <div className="border border-black bg-white rounded-md p-2">
            Revenue : ₹ {parseFloat(revenue).toFixed(2)}
          </div>
        </div>
      </div>
      {filteredOrders.length > 0 ? (
        <div>
          <table className="w-[100%] mt-7 bg-white drop-shadow-md">
            <thead>
              <tr>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700">
                  Table
                </th>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700">
                  Tracking ID
                </th>
                <th className="border-b px-4 py-3 bg-slate-400/10 text-left text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item, i) => (
                <tr key={i}>
                  <td className="border-b px-4 py-5 text-left text-sm">
                    Table {item.table_number}
                  </td>
                  <td className="border-b px-4 py-5 text-left text-sm">
                    {dayjs(item.updatedAt).format("DD-MM-YYYY")}
                  </td>
                  <td className="border-b px-4 py-5 text-left text-sm">
                    ₹{item.total_bill}
                  </td>
                  <td className="border-b px-4 py-5 text-left text-sm">
                    <p className="bg-green-200 rounded-full w-2/3 text-center px-2 pt-[0.15rem] pb-[0.15rem]">
                      {item.payment_method?.paymentType}
                    </p>
                  </td>
                  <td className="border-b px-4 py-5 text-left text-sm">
                    {item.order_id}
                  </td>
                  <td className="rounded hover:cursor-pointer text-xl">
                    <TbArrowBigRightLines
                      onClick={() => {setviewordermodal(true);setvieworder(item)}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">
          No orders found for the selected date.
        </p>
      )}
      {viewordermodal && <ViewOrderDetailsModal onClose={closeviewordermodal} order={vieworder}/>}
    </div>
  );
}

export default BillingHistory;

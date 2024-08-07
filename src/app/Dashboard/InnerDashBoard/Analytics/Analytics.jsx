import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
  BarChart,
  Bar,
} from "recharts";

const Analytics = ({
  revenue = [],
  total_order = 0,
  total_revenue = 0,
  max_order_amount = 0,
  mostsolditems = {},
  weekwisesales = [],
  noofwaiters = 0,
  waiters_present = [],
  waiters_absent = [],
  assignedWaiterNames = [],
  unAssignedWaiterNames = [],
  total_tip_collected = 0,
}) => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-6 space-y-6 md:space-y-0">
        {/* Today's Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-center">Today's Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-100 p-4 rounded-lg shadow-sm flex flex-col justify-center items-center">
              <div className="text-lg font-medium mb-2">
                Orders: {total_order}
              </div>
              <div className="text-lg font-medium">
                Revenue: <span className="font-semibold">₹ {parseFloat(total_revenue)?.toFixed(2)}</span>
              </div>
            </div>
            {total_tip_collected !== undefined && (
              <div className="bg-yellow-100 p-4 rounded-lg shadow-sm flex flex-col justify-center items-center">
                <h3 className="text-lg font-medium mb-2">Total Tip Collected</h3>
                <div className="text-lg font-semibold">
                  ₹ {total_tip_collected}
                </div>
              </div>
            )}
          </div>
          {/* Time vs Revenue Chart */}
          <div className="bg-zinc-100 p-4 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold mb-4">Time vs Revenue</h2>
            <div className="w-full h-[300px] overflow-x-auto">
              <LineChart
                width={700}
                height={300}
                data={revenue}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name">
                  <Label value="Time" offset={-5} position="insideBottom" style={{ fontSize: "14px" }} />
         
                </XAxis>
                <YAxis>
                  <Label value="Revenue (₹)" angle={-90} position="insideLeft" style={{ textAnchor: "middle", fontSize: "14px" }} />
                </YAxis>
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  name="Revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine
                  y={max_order_amount}
                  label={{
                    value: `Max Order Amount (₹${max_order_amount})`,
                    position: "top",
                    offset: 10,
                    style: { fontSize: "12px", fill: "red" },
                  }}
                  stroke="red"
                />
              </LineChart>
            </div>
          </div>
        </div>

        {/* Most Sold Items */}
        <div className="bg-white max-h-[600px] p-4 rounded-lg shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Most Sold Items</h2>
          {Object.keys(mostsolditems).map((key) => (
            <div key={key} className="mb-4">
              <div className="font-semibold text-lg border-b border-dotted border-gray-300 pb-2 mb-2">
                {key}
              </div>
              <div className="space-y-2">
                {mostsolditems[key].map((item, i) => (
                  <div key={i} className="p-2 border-b border-gray-200">
                    <div className="font-medium capitalize">{item.name}</div>
                    <div className="text-sm text-gray-600">Quantity: {item.totalQuantity}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant Growth */}
        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 overflow-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 border-b-2 border-gray-300 pb-2">
            Restaurant Growth
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="w-full h-[300px]">
              <BarChart
                width={500}
                height={300}
                data={weekwisesales}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week">
                  <Label value="" offset={-5} position="insideBottom" style={{ fontSize: "10px", fill: "#4a5568" }} />
                </XAxis>
                <YAxis>
                  <Label value="Total Sales (₹)" offset={-10} angle={-90} position="insideLeft" style={{ textAnchor: "middle", fontSize: "14px", fill: "#4a5568" }} />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#4ade80" />
              </BarChart>
            </div>
          </div>
        </div>

        {/* Waiter Status */}
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Waiter Status</h2>
          <div className="text-lg mb-4">Total Waiters: {noofwaiters}</div>
          <div className="text-lg mb-4">Waiters Present: {waiters_present.length}</div>
          <div className="text-lg mb-4">Waiters Absent: {waiters_absent.length}</div>
          {assignedWaiterNames && (
            <div className="mb-4">
              <div className="font-semibold">Waiters Assigned to Tables: {assignedWaiterNames.length}</div>
              <ul className="list-disc list-inside ml-4">
                {assignedWaiterNames.map((waiter, i) => (
                  <li key={i}>{waiter}</li>
                ))}
              </ul>
            </div>
          )}
          {unAssignedWaiterNames && (
            <div>
              <div className="font-semibold">Waiters Available: {unAssignedWaiterNames.length}</div>
              <ul className="list-disc list-inside ml-4">
                {unAssignedWaiterNames.map((waiter, i) => (
                  <li key={i}>{waiter}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

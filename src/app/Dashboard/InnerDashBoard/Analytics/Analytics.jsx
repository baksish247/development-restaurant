"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Label,
  ReferenceLine,
} from "recharts";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

const Analytics = ({
  revenue,
  total_order,
  total_revenue,
  max_order_amount,
  mostsolditems,
  weekwisesales,
  noofwaiters,
  waiters_present,
  waiters_absent,
  assignedWaiterNames,
  unAssignedWaiterNames,
}) => {
  console.log(mostsolditems.Breads);
  Object.keys(mostsolditems).map((key) => {
    console.log(key, mostsolditems[key]); // Example transformation
  });

  const progressValue = 66; // Example progress value

  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="md:grid md:grid-cols-4 md:grid-rows-2 md:gap-8 h-full">
        {/* Line Chart */}
        <div className="border flex items-center justify-center  md:col-span-3">
          <div className="rounded-lg drop-shadow-md bg-gray-200 text-left flex flex-col border border-gray-700 items-center justify-center p-4">
            <div className="font-semibold  text-xl mb-6">Today's Stats :</div>
            <div className="font-medium text-left text-lg">
              Orders : {total_order}
            </div>

            <div className="font-medium text-lg">Revenue:</div>
            <div className="font-semibold  text-xl">₹ {total_revenue}</div>
          </div>
          <div className=" flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-4">Time vs Revenue</h2>
            <div className="w-full h-full">
              <div
                style={{ width: "80%", height: "80%" }}
                className="mx-auto h-full"
              >
                <LineChart
                  width={0.8 * 700}
                  height={0.8 * 300}
                  data={revenue}
                  margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name">
                    <Label
                      value=""
                      offset={-5}
                      position="insideBottom"
                      style={{ padding: "10px" }}
                    />
                  </XAxis>
                  <YAxis>
                    <Label
                      value="Revenue (₹)"
                      angle={-90}
                      position="insideLeft"
                      style={{
                        textAnchor: "middle",
                        fill: "#8884d8",
                        padding: "10px",
                      }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    name="Hours"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    style={{ textAnchor: "middle" }}
                  />
                  <ReferenceLine
                    y={max_order_amount}
                    label={{
                      value: `Max order amount (${"₹" + max_order_amount})`,
                      position: "top",
                      offset: 10,
                      style: {
                        fontSize: "12px",
                        fill: "red",
                        textAnchor: "end",
                      },
                    }}
                    stroke="red"
                  />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        {/* Most sold */}
        <div className="border p-4 flex items-center overflow-y-auto ">
          <div className="flex-col space-y-5">
            {Object.keys(mostsolditems).map((key) => {
              return (
                <div className="w-full">
                  <div className="text-left font-semibold text-lg border-b border-dotted border-black">
                    {key}
                  </div>
                  <div className="flex-col space-y-2">
                    {mostsolditems[key].map((item, i) => {
                      return (
                        <div key={i}>
                          <div>{item.name}</div>
                          <div className="text-sm">
                            Quantity : {item.totalQuantity}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ); // Example transformation
            })}
          </div>
        </div>
        {/* Restaurant Growth */}
        <div className="border p-4 md:col-span-2">
          <h2 className="text-xl text-center font-semibold mb-2">
            Restaurant Growth
          </h2>
          <div className="w-full h-full">
            <div
              style={{ width: "80%", height: "80%" }}
              className="mx-auto h-full"
            >
              <BarChart
                width={0.8 * 500}
                height={0.8 * 300}
                data={weekwisesales}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week">
                  <Label
                    value="Week"
                    offset={-5}
                    position="insideBottom"
                    style={{ padding: "10px" }}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Total Sales (₹)"
                    angle={-90}
                    position="insideLeft"
                    style={{
                      textAnchor: "middle",
                      fill: "#8884d8",
                      padding: "10px",
                    }}
                  />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </div>
        {/* Waiter Status */}
        <div className="border p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Waiter Status</h2>
          <p>Total Waiters : {noofwaiters}</p>
          <p>Waiters Present: {waiters_present.length}</p>
          <p>Waiters Absent: {waiters_absent.length}</p>
          {assignedWaiterNames && (
            <div>
              <div>
                Waiters assigned to tables : {assignedWaiterNames.length}
              </div>
              {assignedWaiterNames.map((waiter,i)=>{
                return(
                  <div key={i}>{waiter}</div>
                )
              })}
            </div>
          )}
          {unAssignedWaiterNames && (
            <div>
              <div>
                Waiters available : {unAssignedWaiterNames.length}
              </div>
              {unAssignedWaiterNames.map((waiter,i)=>{
                return(
                  <div key={i}>{waiter}</div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

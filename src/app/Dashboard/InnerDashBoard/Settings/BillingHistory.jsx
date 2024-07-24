import axios from "axios";
import React, { useEffect, useState } from "react";

function BillingHistory({user}) {
  console.log(user);
  const [orders, setorders] = useState([])
  const fetchallorder=async()=>{
    try{
      const res=await axios.post('/api/fetchcompletedorders',{restaurant_id:user.restaurantid})
      setorders(res.data.data);
    }catch(err){
      console.error('Error fetching orders:',err)
    }
  }

  useEffect(()=>{
    fetchallorder();
  },[])

  return (
    <div>
      <div>
        <p className="text-lg font-medium">Billing History</p>
        <p className="text-gray-500 text-sm mt-1">See all the previous bills</p>
      </div>
      {orders &&<div>
        <table className="w-[95%] mt-7">
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
            </tr>
          </thead>
          <tbody>
            {orders.map((item,i)=>(<tr key={i}>
              <td className="border-b px-4 py-5 text-left text-sm">Table {item.table_number}</td>
              <td className="border-b px-4 py-5 text-left text-sm">
                {new Date(item.updatedAt).getDate().toString().padStart(2, "0")}-{(new Date(item.updatedAt).getMonth() + 1).toString().padStart(2, "0")}-{new Date(item.updatedAt).getFullYear()}
              </td>
              <td className="border-b px-4 py-5 text-left text-sm">₹{item.total_bill}</td>
              <td className="border-b px-4 py-5 text-left text-sm">
                <p className="bg-green-200 rounded-full w-1/2 px-2 pt-[0.15rem] pb-[0.15rem]">
                  Cash
                </p>
              </td>
              <td className="border-b px-4 py-5 text-left text-sm">
              {item.order_id}
              </td>
            </tr>))}
            <tr>
              <td className="border-b px-4 py-5 text-left text-sm">Table 1</td>
              <td className="border-b px-4 py-5 text-left text-sm">
                2022-01-01
              </td>
              <td className="border-b px-4 py-5 text-left text-sm">₹1500</td>
              <td className="border-b px-4 py-5 text-left text-sm">
                <p className="bg-red-200 rounded-full w-1/2 px-2 pt-[0.15rem] pb-[0.15rem]">
                  Card
                </p>
              </td>
              <td className="border-b px-4 py-5 text-left text-sm">
                12DFG3HJ34RJKKJ18JHG
              </td>
            </tr>
          </tbody>
        </table>
      </div>}
    </div>
  );
}

export default BillingHistory;

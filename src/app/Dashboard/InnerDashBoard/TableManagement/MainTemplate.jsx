import React, { useEffect, useState } from "react";
import TableCard from "./TableDetails/TableCard";
import axios from "axios";
import { useSidebar } from "@/app/Context/SidebarContext";

function MainTemplate({ user }) {
  const { sidebarOpen, tooglesidebar } = useSidebar();
  console.log(sidebarOpen)
  const [orders, setorders] = useState([]);
  const [alltables, setalltables] = useState([]);
  const [nooftables, setnooftables] = useState(0);
  const [addedorder, setaddedorder] = useState(false)
  console.log(user);

  const fetchorder = async () => {
    try {
      const res_details = await axios.post("/api/getrestaurantdetails", {
        restaurantid: user.restaurantid,
      });
      if (res_details.data.success) {
        const numTables = res_details.data.data.nooftables;
        setnooftables(numTables);
        console.log(numTables);

        const tablesArray = [];
        for (let i = 1; i <= numTables; i++) {
          tablesArray.push({ number: i, orderdetails: null });
        }

        const res_orders = await axios.post("/api/fetchallordersbyid", {
          restaurant_id: user.restaurantid,
        });
        if (res_orders.data.success) {
          const fetchedOrders = res_orders.data.data;
          setorders(fetchedOrders);
          const updatedTablesArray = tablesArray.map(table => {
            const ordersForTable = fetchedOrders.filter(
              order => parseInt(order.table_number) === table.number
            );
            return {
              ...table,
              orderdetails: ordersForTable.length > 0 ? ordersForTable : {order_status:"empty"},
            };
          });

          setalltables(updatedTablesArray);
          setaddedorder(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchorder();
  }, []);

  if (addedorder) {
    console.log(alltables);
  }

  return (
    <div className={`${sidebarOpen?"lg:px-2":"lg-px-20"} grid mx-4 grid-cols-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6 xl:gap-6 gap-4 justify-items-center mt-10`}>
      {addedorder && alltables.map((item, i) => (
        <div  key={i}><TableCard table={item} /></div>
      ))}
    </div>
  );
}

export default MainTemplate;

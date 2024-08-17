import React, { useEffect, useState } from "react";
import TableCard from "./TableDetails/TableCard";
import axios from "axios";
import { useSidebar } from "@/app/Context/SidebarContext";

function MainTemplate({ user }) {
  const { sidebarOpen, tooglesidebar } = useSidebar();
  const [orders, setorders] = useState([]);
  const [alltables, setalltables] = useState([]);
  const [nooftables, setnooftables] = useState(0);
  const [addedorder, setaddedorder] = useState(false)
  const [cgst, setcgst] = useState("")
  const [sgst, setsgst] = useState("")
  const [restaurantname, setrestaurantname] = useState("")
  const [restaurantphoneNo, setrestaurantphoneNo] = useState("")
  const [restaurantaddress, setrestaurantaddress] = useState("")
  const fetchorder = async () => {
    try {
      const res_details = await axios.post("/api/getrestaurantdetails", {
        restaurantid: user.restaurantid,
      });
      if (res_details.data.success) {
        //console.log(res_details.data.data)
        const numTables = res_details.data.data.nooftables;
        setnooftables(numTables);
        setcgst(res_details.data.data.cgst)
        setsgst(res_details.data.data.sgst)
        setrestaurantname(res_details.data.data.restaurantname)
        setrestaurantphoneNo(res_details.data.data.restaurantphoneNo)
        setrestaurantaddress(res_details.data.data.restaurantaddress)
        const tablesArray = [];
        for (let i = 1; i <= numTables; i++) {
          tablesArray.push({ number: i, orderdetails: null });
        }

        const res_orders = await axios.post("/api/fetchallordersbyid", {
          restaurant_id: user.restaurantid,
        });
        const reservedtables=await axios.post("/api/fetchreservedtables",{restaurant_id: user.restaurantid});

        if (res_orders.data.success && reservedtables.data.success) {
          const reservetables=reservedtables.data.data.reserved_tables;
          const fetchedOrders = res_orders.data.data;
          setorders(fetchedOrders);
          const updatedTablesArray = tablesArray.map(table => {
            const ordersForTable = fetchedOrders?.filter(
              order => parseInt(order.table_number) === table.number
            );
            return {
              ...table,
              orderdetails: ordersForTable.length > 0 ? ordersForTable : {order_status:"empty"},
            };
          });
          const finalTablesArray = updatedTablesArray?.map(table => {
            const reservedTable = reservetables?.find(
              reserved => parseInt(reserved.table_number) === table.number
            );
            if (reservedTable) {
              return {
                ...table,
                orderdetails: { order_status: "reserved" },
              };
            }
            return table; // Keep the existing orderdetails if no match in reservetables
          });
         // console.log(updatedTablesArray)
          //console.log(finalTablesArray)
          setalltables(finalTablesArray);
          setaddedorder(true);
        }
      }
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    fetchorder();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchorder();
    }, 100000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  if(!addedorder) {
    return <div className="flex justify-center items-center mt-40">
    <span className="loader"></span>
  </div>
  }

  return (
    <div className={`${sidebarOpen?"lg:px-2":"lg-px-20"} grid mx-4  grid-cols-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6 xl:gap-6 gap-4 justify-items-center mt-20`}>
      {addedorder && alltables.map((item, i) => (
        <div  key={i}><TableCard table={item} nooftables={nooftables} cgst={cgst} sgst={sgst} restaurantid={user.restaurantid} restaurantname={restaurantname} restaurantphoneNo={restaurantphoneNo} restaurantaddress={restaurantaddress} fetchorder={fetchorder}/></div>
      ))}
    </div>
  );
}

export default MainTemplate;

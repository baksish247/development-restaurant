"use client";
import React, { useEffect, useState } from "react";
import ComingSoon from "../ComingSoon";
import Analytics from "./Analytics";
import axios from "axios";
import { parseISO, startOfWeek, endOfWeek, format, addWeeks } from "date-fns";

function page() {
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);
  const [hourwiserevenue, sethourwiserevenue] = useState([]);
  const [count_orders, setcount_orders] = useState(0);
  const [tot_revenue, settot_revenue] = useState(0);
  const [maximumorderamount, setmaximumorderamount] = useState("");
  const [mostsolditems, setmostsolditems] = useState([]);
  const [waiterdetails, setwaiterdetails] = useState([]);
  const [noofwaiters, setnoofwaiters] = useState(0);
  const [waiters_present, setwaiters_present] = useState([]);
  const [waiters_absent, setwaiters_absent] = useState([]);
  const [assignedWaiterNames, setAssignedWaiterNames] = useState([]);
  const [totaltip, settotaltip] = useState();
  const [unAssignedWaiterNames, setunAssignedWaiterNames] = useState([]);
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getTopItemsByCategory = (orders) => {
    const categoryMap = new Map();

    // Iterate through each order
    orders.forEach((order) => {
      order.order_items.forEach((orderItem) => {
        orderItem.items.forEach((item) => {
          if (item.food) {
            const category = item.food.category;
            const itemId = item.food._id;
            const quantity = parseInt(item.quantity, 10);

            if (!categoryMap.has(category)) {
              categoryMap.set(category, new Map());
            }

            const categoryItems = categoryMap.get(category);
            if (!categoryItems.has(itemId)) {
              categoryItems.set(itemId, {
                id: itemId,
                name: item.food.name,
                image: item.food.image,
                price: item.food.price,
                category: category,
                description: item.food.description,
                totalQuantity: 0, // Initialize total quantity
                maxQuantity: 0, // Initialize maximum quantity
              });
            }

            // Update total quantity
            const itemData = categoryItems.get(itemId);
            itemData.totalQuantity += quantity;

            // Update maximum quantity
            if (quantity > itemData.maxQuantity) {
              itemData.maxQuantity = quantity;
            }
          }
        });
      });
    });

    // Prepare the result
    const result = {};

    // Iterate through each category
    categoryMap.forEach((items, category) => {
      // Convert the items map to an array and sort by maxQuantity in descending order
      const sortedItems = Array.from(items.values()).sort(
        (a, b) => b.totalQuantity - a.totalQuantity
      );
      result[category] = sortedItems.slice(0, 2);
    });
    //console.log(result);
    return result;
  };

  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const startFormatted = format(start, "dd");
    const endFormatted = format(end, "dd MMMM");
    return `${startFormatted}-${endFormatted}`;
  };

  const getCurrentMonthYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return { currentMonth, currentYear };
  };

  const getWeeklyTotalSales = (orders) => {
    // Get current month and year
    const { currentMonth, currentYear } = getCurrentMonthYear();
  
    // Initialize a map to accumulate weekly sales
    const weeklySalesMap = new Map();
  
    // Iterate over each order
    orders.forEach((order) => {
      // Parse the order date once
      const orderDate = parseISO(order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
  
      // Check if the order belongs to the current month and year
      if (orderMonth === currentMonth && orderYear === currentYear) {
        // Get the week range for the order date
        const weekRange = getWeekRange(orderDate);
  
        // Update the weekly sales map
        const currentSales = weeklySalesMap.get(weekRange) || 0;
        weeklySalesMap.set(weekRange, currentSales + parseFloat(order.total_bill));
      }
    });
  
    // Convert map to array of objects
    return Array.from(weeklySalesMap, ([week, sales]) => ({ week, sales }));
  };
  
  const getwaiterdetails = async (resid) => {
    const res = await axios.post("/api/getwaiters", { restaurant_id: resid });
    if (res.data.success) {
      console.log(res.data.data);
      setnoofwaiters(res.data.data.length);
      const presentwaiters = res.data?.data.filter(
        (waiter) => waiter.ispresent === true
      );
      const absentwaiters = res.data?.data.filter(
        (waiter) => waiter.ispresent === false
      );
      setwaiters_present(presentwaiters);
      setwaiters_absent(absentwaiters);
      const orderres = await axios.post("/api/fetchallordersbyid", {
        restaurant_id: resid,
      });
      if (orderres.data.success) {
        console.log(orderres.data.data);
        const allOrders = orderres.data.data;
        const waiterNames = new Set(); // Use a Set to avoid duplicate names

        allOrders.forEach((order) => {
          if (order.waiter_name != null || order.waiter_name != undefined)
            waiterNames.add(order.waiter_name); // Assuming waiter object has a 'name' property
        });

        // Convert Set to Array and store in state
        setAssignedWaiterNames(Array.from(waiterNames));
        console.log(presentwaiters);
        console.log(waiterNames);
        const freewaiters = new Set();
        presentwaiters.forEach((waiter) => {
          if (!waiterNames.has(waiter.username)) {
            console.log(waiter);
            freewaiters.add(waiter.username);
          }
        });
        setunAssignedWaiterNames(Array.from(freewaiters));
      }
    }
  };
  const [weekwisesales, setweekwisesales] = useState([]);
  const fetchcompletedorders = async (resid) => {
    try {
      const { data } = await axios.post("/api/fetchcompletedorders", {
        restaurant_id: resid,
      });
      setorders(data?.data || []);
      await getwaiterdetails(resid);
      const paidOrders = data?.data.filter(
        (order) =>
          order.order_status === "paid" && isToday(new Date(order.createdAt))
      );
      const topItemsByCategory = getTopItemsByCategory(paidOrders);
      setmostsolditems(topItemsByCategory);
      const paidOrdersweekly = data?.data.filter(
        (order) => order.order_status === "paid"
      );
      const weeklsales = getWeeklyTotalSales(paidOrdersweekly);
      setweekwisesales(weeklsales);
      console.log(weeklsales);
      // Step 2: Create a map to accumulate revenue by hour
      const revenueByHour = paidOrders.reduce((acc, order) => {
        const hour = new Date(order.createdAt).getHours();
        const totalBill = parseFloat(order.total_bill);

        if (!acc[hour]) {
          acc[hour] = { revenue: 0, count: 0 };
        }

        acc[hour].revenue += totalBill;
        acc[hour].count += 1;
        return acc;
      }, {});

      // Step 3: Determine the range of hours
      const hours = Object.keys(revenueByHour).map((hour) => parseInt(hour));
      const minHour = Math.min(...hours);
      const maxHour = Math.max(...hours);

      // Step 4: Create the result array with all hours in the range
      const result = [];
      let totalOrders = 0;
      let totalRevenue = 0;
      let maxrevenue = 0;
      for (let hour = minHour; hour <= maxHour; hour++) {
        const data = revenueByHour[hour] || { revenue: 0, count: 0 };
        result.push({
          name: hour + ":00",
          Revenue: data.revenue,
        });
        maxrevenue = data.revenue > maxrevenue ? data.revenue : maxrevenue;
        totalRevenue += data.revenue;
        totalOrders += data.count;
      }
      //console.log(totalOrders, totalRevenue);
      setmaximumorderamount(maxrevenue);
      setcount_orders(totalOrders);
      settot_revenue(totalRevenue);
      //console.log(result);
      sethourwiserevenue(result);
      setloading(false); // Set loading to false once data is received
    } catch (error) {
      console.error("Error fetching orders:", error);
      setloading(false); // Ensure loading is false even if there's an error
    }
  };
  const fetchtipamount = async(resid)=>{
    try {
      const { data } = await axios.post("/api/fetchalltip", { restaurant_id: resid });
      console.log("tip",data);
      
      settotaltip(data?.total || 0);
    } catch (error) {
      console.error("Error fetching tip amount:", error);
    }
  }

  useEffect(() => {
    const resid = localStorage.getItem("restaurantid");
    if (resid) {
      fetchtipamount(resid);
      fetchcompletedorders(resid);
      // Fetch total tip amount for the restaurant
    } else {
      setloading(false); // If no restaurant id, set loading to false
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div>
      {/* <ComingSoon /> */}
      <Analytics
        revenue={hourwiserevenue}
        total_order={count_orders}
        total_revenue={tot_revenue}
        max_order_amount={maximumorderamount}
        mostsolditems={mostsolditems}
        weekwisesales={weekwisesales}
        noofwaiters={noofwaiters}
        waiters_present={waiters_present}
        waiters_absent={waiters_absent}
        assignedWaiterNames={assignedWaiterNames}
        unAssignedWaiterNames={unAssignedWaiterNames}
        total_tip_collected={totaltip}
      />
    </div>
  );
}

export default page;

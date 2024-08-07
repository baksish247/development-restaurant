"use client";
import { useAuth } from "@/app/Context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avater from "../../assets/images/avater.gif";
import Link from "next/link";
import DashboardCard from "./DashboardCard";
import { Logout } from "@/app/Components/LoginComponent/utils/loginhelpers";
import { toast, Toaster } from "react-hot-toast";
import billing_img from "../../assets/images/billing.jpg";
import restaurant_menu_img from "../../assets/images/restaurant_menu.jpg";
import table_management_img from "../../assets/images/table_management.jpg";
import waiter_management_img from "../../assets/images/waiter_management.jpg";
import inventory_management_img from "../../assets/images/inventory_management.jpg";
import analytics_img from "../../assets/images/analytics.jpg";
import { IoSettingsSharp } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";

function DashboardMain() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Action not allowed\nplease login");
      router.push("/");
    }
  }, [loading, user, router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <nav className="lg:flex justify-between lg:px-20 items-center p-2">
        <div className="flex justify-between items-center w-full lg:w-auto">
          <div className="flex justify-start space-x-2 items-center">
            <Image
              height={100}
              width={100}
              src={avater}
              alt="avater"
              unoptimized
              className="h-16 w-16 border-2 rounded-full"
            />
            <p className="text-2xl font-semibold">Hello, {user?.name}</p>
          </div>
          <button
            className="lg:hidden block text-3xl focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
        <ul
          className={`lg:flex justify-center mr-4 space-x-10 z-50 items-center lg:static absolute right-0 top-14 bg-white rounded-md lg:bg-transparent p-5 lg:p-0 transition-transform ${
            isMenuOpen ? "block" : "hidden"
          } lg:block mt-4 lg:mt-0`}
        >
          <Link
            className="cursor-pointer"
            href={"/Dashboard/InnerDashBoard/PastOrders"}
          >
            <li className="font-medium text-lg custom-underline">
              Past Orders
            </li>
          </Link>

          <Link className="cursor-pointer flex items-center" href={"/Support"}>
            <li className="font-medium text-lg custom-underline">
              Support
            </li>
          </Link>
          <Link
            className="cursor-pointer flex items-center"
            href={"/Dashboard/InnerDashBoard/Settings"}
          >
            <li className="font-medium text-lg custom-underline">
              Settings
            </li>
          </Link>
          <li
            onClick={Logout}
            className="cursor-pointer font-medium text-lg custom-underline"
          >
            Logout
          </li>
        </ul>
      </nav>

      <section>
        <div className="grid lg:grid-cols-3 grid-cols-1 mt-4 lg:gap-10 gap-2 justify-items-center items-center px-2 lg:px-64">
          <DashboardCard
            isactive={true}
            imgurl={table_management_img}
            label={"Table Management"}
            url={"/Dashboard/InnerDashBoard/TableManagement"}
          />
          <DashboardCard
            isactive={true}
            imgurl={waiter_management_img}
            label={"Waiter Management"}
            url={"/Dashboard/InnerDashBoard/WaiterManagement"}
          />

          <DashboardCard
            isactive={true}
            imgurl={restaurant_menu_img}
            label={"Restaurant Menu"}
            url={"/Dashboard/InnerDashBoard/RestaurantMenu"}
          />
          <DashboardCard
            isactive={true}
            imgurl={billing_img}
            label={"Billing"}
            url={"/Dashboard/InnerDashBoard/Billing"}
          />
          <DashboardCard
            isactive={true}
            imgurl={inventory_management_img}
            label={"Inventory Management"}
            url={"/Dashboard/InnerDashBoard/InventoryManagement"}
          />
          <DashboardCard
            isactive={true}
            imgurl={analytics_img}
            label={"Analytics"}
            url={"/Dashboard/InnerDashBoard/Analytics"}
          />
        </div>
      </section>
    </>
  );
}

export default DashboardMain;

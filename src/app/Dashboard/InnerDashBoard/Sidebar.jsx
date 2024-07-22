import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoCloseCircleOutline, IoAnalyticsSharp } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import avater from "../../assets/images/avater.png";
import { MdTableRestaurant } from "react-icons/md";
import { LuChefHat } from "react-icons/lu";
import { MdOutlineMenuBook } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";

function Sidebar({ sidebarOpen, refs, tooglesidebar, user }) {
  return (
    <div className={`${sidebarOpen ? "lg:w-64" : ""}`}>
      <div
        ref={refs}
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } transform transition-transform z-30 duration-500 fixed  top-0 left-0 h-screen`}
      >
        <aside className="w-64 bg-[#440129] bg-opacity-90 backdrop-blur-sm text-white p-6 border border-white border-opacity-20 shadow-lg h-full">
          <button
            onClick={tooglesidebar}
            className="absolute top-4 right-4 text-white"
          >
            <IoCloseCircleOutline className="text-3xl" />
          </button>
          <div className=" flex flex-col py-10 justify-center items-center">
            <Image
              src={avater}
              className="mix-blend-screen"
              height={180}
              width={180}
              alt="pic"
            />
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>

          <nav>
            <div>
              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/TableManagement"
              >
                <MdTableRestaurant />
                <span>Table Management</span>
              </Link>

              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/WaiterManagement"
              >
                <LuChefHat />
                <span>Waiter Management</span>
              </Link>
              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/RestaurantMenu"
              >
                <MdOutlineMenuBook />
                <span>Restaurant Menu</span>
              </Link>

              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/Billing"
              >
                <LiaFileInvoiceDollarSolid /> <span>Biling</span>
              </Link>

              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/Analytics"
              >
                <IoAnalyticsSharp />
                <span>Analytics</span>
              </Link>

              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/InventoryManagement"
              >
                <MdOutlineInventory2 />
                <span>Inventory Details</span>
              </Link>

              <Link
                className="mb-4 bg-[#fff9ea] text-[#441029] text-base p-2 rounded-lg opacity-90 hover:bg-[#441029] hover:text-[#fff9ea] flex justify-start  space-x-1 items-center"
                href="/Dashboard/InnerDashBoard/Settings"
              >
                <VscSettingsGear />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}

export default Sidebar;

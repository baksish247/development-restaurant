"use client";
import React, { useEffect, useRef, useState } from "react";
import TopBar from "../DashboardComponents/TopBar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/app/Context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function InnerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [title, settitle] = useState("Welcome")
  useEffect(() => {
    const path = pathname.split("/").pop();
    changetitle(path);
  }, [pathname]);

  const changetitle = (path) => {
    switch (path) {
      case "WaiterManagement":
        settitle("Waiter Management");
        break;
      case "RestaurantMenu":
        settitle("Restaurant Menu");
        break;
      case "profile":
        settitle("Profile");
        break;
      case "TableManagement":
        settitle("Table Management");
        break;
      // Add more cases as needed
      default:
        settitle("Welcome");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user && !loading) {
    window.location = "/";
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ref = useRef();

  const tooglesidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = ref.current;
    if (sidebar.classList.contains("-translate-x-64")) {
      sidebar.classList.remove("-translate-x-64");
      sidebar.classList.add("translate-x-0");
    } else {
      sidebar.classList.remove("translate-x-0");
      sidebar.classList.add("-translate-x-64");
    }
  };

  return (
    <div>
      <div className="flex">
        <Sidebar
          refs={ref}
          user={user}
          sidebarOpen={sidebarOpen}
          tooglesidebar={tooglesidebar}
        />
        <main className="flex-1 ">
          <TopBar
            tooglesidebar={tooglesidebar}
            title={title}
            changetitle={changetitle}
            sidebarOpen={sidebarOpen}
          />
          {children}
        </main>
      </div>
    </div>
  );
}

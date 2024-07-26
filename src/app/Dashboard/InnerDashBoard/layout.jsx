"use client";
import React, { useEffect, useRef, useState } from "react";
import TopBar from "../DashboardComponents/TopBar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/app/Context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/app/Context/SidebarContext";

export default function InnerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [title, settitle] = useState("Welcome");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }
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
      case "Settings":
        settitle("Settings");
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      <div className="flex ">
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
          <SidebarProvider
            sidebarOpen={sidebarOpen}
            tooglesidebar={tooglesidebar}
          >
            {children}
          </SidebarProvider>
        </main>
      </div>
    </div>
  );
}

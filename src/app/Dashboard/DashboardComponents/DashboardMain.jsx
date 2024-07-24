"use client";
import { useAuth } from "@/app/Context/AuthContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avater from "../../assets/images/avater.gif";
import Link from "next/link";
import DashboardCard from "./DashboardCard";
import { Logout } from "@/app/Components/LoginComponent/utils/loginhelpers";
import { toast, Toaster } from "react-hot-toast";

function DashboardMain() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Action not allowed\nplease login");
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

  return (
    <>
      <Toaster />
      <nav className="lg:flex justify-between lg:px-20 items-center p-2">
        <div className="flex justify-start space-x-2 items-center">
          <Image
            height={100}
            width={100}
            src={avater}
            alt="avater"
            className="h-16 w-16 border-2 rounded-full"
          />
          <p className="text-2xl font-semibold">Hello, {user?.name}</p>
        </div>
        <ul className="flex justify-center space-x-10">
          <Link className="cursor-pointer" href={"/"}>
            <li className="font-medium text-lg custom-underline">
              Past Orders
            </li>
          </Link>
          <Link className="cursor-pointer" href={"/Support"}>
            <li className="font-medium text-lg custom-underline">Support</li>
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
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Table Management"}
            url={"/Dashboard/InnerDashBoard/TableManagement"}
          />
          <DashboardCard
            isactive={true}
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Waiter Management"}
            url={"/Dashboard/InnerDashBoard/WaiterManagement"}
          />

          <DashboardCard
            isactive={true}
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Restaurant Menu"}
            url={"/Dashboard/InnerDashBoard/RestaurantMenu"}
          />
          <DashboardCard
            isactive={true}
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Billing"}
            url={"/Dashboard/InnerDashBoard/TableManagement"}
          />
          <DashboardCard
            isactive={false}
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Analytics"}
            url={"/Dashboard/InnerDashBoard/TableManagement"}
          />
          <DashboardCard
            isactive={false}
            imgurl={
              "https://rishikeshcamps.in/wp-content/uploads/2023/05/restaarant.jpg"
            }
            label={"Inventory Management"}
            url={"/Dashboard/InnerDashBoard/TableManagement"}
          />
        </div>
      </section>
    </>
  );
}

export default DashboardMain;

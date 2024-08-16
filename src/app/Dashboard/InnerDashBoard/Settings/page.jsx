"use client";
import React, { useState, useEffect } from "react";
import ProfilePage from "./profilePage";
import BillingHistory from "./BillingHistory";
import MenuPage from "./MenuPage";
import TeamPage from "./TeamPage";
import PlanPage from "./PlanPage";
import NotificationsPage from "./Notifications";
import ContactPage from "./Contactpage";
import { useAuth } from "@/app/Context/AuthContext";
import { useRouter } from "next/navigation";
import Events from "./Events";
import Offers from "./Offers";
import Resetpassword from "./Resetpassword";

function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState("Profile");
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else {
      const savedSection = localStorage.getItem("currentSection");
      if (savedSection) {
        setCurrentSection(savedSection);
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    localStorage.setItem("currentSection", currentSection);
  }, [currentSection]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case "Profile":
        return <ProfilePage />;
      case "Menu":
        return <MenuPage />;
      case "Team":
        return <TeamPage />;
      case "Plan":
        return <PlanPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Events":
        return <Events />;
      case "Offers":
        return <Offers />;
      case "Reset Password":
        return <Resetpassword />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="px-4 mt-4 lg:px-10">
      <nav className="w-full bg-zinc-200 rounded-md flex lg:flex-nowrap flex-wrap justify-between lg:justify-start items-center">
        {[
          "Profile",
          "Menu",
          "Team",
          "Plan",
          "Notifications",
          "Events",
          "Offers",
          "Reset Password",
        ].map((item) => (
          <span
            key={item}
            onClick={() => setCurrentSection(item)}
            className={`font-medium text-zinc-700 hover:bg-white px-4 lg:px-6 border-transparent p-2 border-b-2 hover:border-zinc-800 cursor-pointer transition-colors ${
              currentSection === item ? "border-zinc-800" : ""
            }`}
          >
            {item}
          </span>
        ))}
      </nav>
      <section className="p-2">{renderSection()}</section>
    </div>
  );
}

export default Page;

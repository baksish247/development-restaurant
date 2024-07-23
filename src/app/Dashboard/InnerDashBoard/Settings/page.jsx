"use client";
import React from "react";
import ProfilePage from "./profilePage";
import BillingHistory from "./BillingHistory";

function Page() {
  return (
    <div className=" px-4 mt-4 lg:px-10">
      <nav className="w-full bg-zinc-200 rounded-md flex lg:flex-nowrap flex-wrap justify-between lg:justify-start  items-center ">
        {["Profile", "Menu", "Team", "Plan", "Notifications", "Contact"].map(
          (item) => (
            <span
              key={item}
              className="font-medium text-zinc-700 hover:bg-white px-4 lg:px-6 border-transparent p-2 border-b-2 hover:border-zinc-800 cursor-pointer transition-colors"
            >
              {item}
            </span>
          )
        )}
      </nav>
      <section className="p-2">
        {/* <ProfilePage/> */}
        <BillingHistory />
      </section>
    </div>
  );
}

export default Page;

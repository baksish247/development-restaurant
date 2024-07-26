"use client";
import { Logout } from "@/app/Components/LoginComponent/utils/loginhelpers";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";

function TopBar({ title, tooglesidebar, sidebarOpen }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`lg:flex justify-between items-center py-4 lg:px-4 bg-white z-20 lg:pr-10 sticky top-0 transition-shadow duration-300 ${
        hasScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-start space-x-4  items-center text-2xl h-10 font-semibold ">
        <span className="lg:block hidden">
        {!sidebarOpen && (
          <HiOutlineMenuAlt4
            onClick={tooglesidebar}
            className="size-10 border-rose-800 font-bold border-2 rounded-full p-2"
          />
        )}</span>
        <span className="lg:hidden">
        <HiOutlineMenuAlt4
            onClick={tooglesidebar}
            className="size-10 border-rose-800 font-bold border-2 rounded-full p-2"
          />
        </span>
        <div>
        <p className="tracking-wider">{title}</p>
        {/* <div  className="w-full h-1 bg-gradient-to-r from-[#c34e86] rounded-full"/> */}
        </div>
      </div>
 
      <ul className="flex justify-center space-x-10">
        <Link className="cursor-pointer" href={"/"}>
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
  );
}

export default TopBar;

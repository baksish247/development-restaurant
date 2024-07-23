"use client";
import Image from "next/image";
import React from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineTextsms } from "react-icons/md";
import avater from "../../../assets/images/avater.png";
import { useAuth } from "@/app/Context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="p-4 ">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="flex-shrink-0 w-full lg:w-1/3 bg-gray-50 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className=" bg-gray-200 rounded-full ">
              <Image
                src={avater}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full s-full h-full"
              />
            </div>
            <p className="text-xl font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500 mb-6">Restaurant Name</p>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-lg font-semibold text-gray-800">Outlets</p>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Primary</p>
              <p className="text-sm text-gray-700">
                123/A, dftgygfcgvbhjn street
                <br />
                gvbhjnhbg, Shahid Nagar,
                <br />
                Kolkata-751024
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Secondary</p>
              <p className="text-sm text-gray-700">
                123/A, dftgygfcgvbhjn street
                <br />
                gvbhjnhbg, Shahid Nagar,
                <br />
                Kolkata-751024
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full lg:w-2/3">
          <div className="bg-white p-7 rounded-lg shadow-lg">
            <div className="flex justify-start space-x-4 items-center mb-5">
              <div className="text-lg cursor-pointer flex justify-center items-center font-semibold text-gray-800">
                <MdOutlineTextsms className="size-6" />
                Send Message
              </div>
              <div className="text-lg font-semibold text-gray-500 cursor-pointer">
                Details
              </div>
            </div>
            <div className="border-b border-gray-300 mb-4"></div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="from"
              >
                From:
              </label>
              <p className="text-gray-600">
                default_restaurant_email (no input to be taken)
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="to"
              >
                To:
              </label>
              <p className="text-gray-600">
                Baksish247@gmail.com (pre-defined, no input to be taken)
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message Area
              </label>
              <textarea
                id="message"
                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white  px-6 py-2 rounded-lg flex items-center border border-black hover:drop-shadow-lg  transition-colors"
              >
                <span> Send</span> <FiSend className="ml-2 text-blue-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

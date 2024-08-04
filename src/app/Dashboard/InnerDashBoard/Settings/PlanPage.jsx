"use client"
import React from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// Example data - replace with your actual data source
const trialEndDate = dayjs().add(14, "days"); // Assuming a 14-day trial
const currentPlan = "Basic";
const remainingDays = trialEndDate.diff(dayjs(), "days");

const PlanPage = () => {
  const router = useRouter();

  // Redirect to pricing page
  const handleRedirect = () => {
    router.push("https://www.baksish.in");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-zinc-800 mb-6">
          Your Plan Details
        </h1>

        {/* Free Trial Section */}
        <div className="bg-zinc-100 text-zinc-600 rounded-lg p-4 mb-6">
          <h2 className="text-xl text-orange-400 font-semibold">Free Trial Activated</h2>
          <p className="text-lg mt-2">
            Your free trial is active. You have <strong>{remainingDays}</strong> days left.
          </p>
        </div>

        {/* Current Plan Section */}
        {/* <div className="bg-orange-300 text-white rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold">Current Plan</h2>
          <p className="text-lg mt-2">
            You are currently subscribed to the <strong>{currentPlan}</strong> plan.
          </p>
        </div> */}

        {/* Redirect Button */}
        <button
          onClick={handleRedirect}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          View Pricing Plans
        </button>
      </div>
    </div>
  );
};

export default PlanPage;

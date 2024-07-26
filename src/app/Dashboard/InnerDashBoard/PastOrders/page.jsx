"use client";
import React, { useState, useEffect } from "react";
import BillingHistory from "./BillingHistory";
import { useAuth } from "@/app/Context/AuthContext";
import { useRouter } from "next/navigation";

function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 lg:px-10">
      <BillingHistory user={user}/>
    </div>
  );
}

export default Page;

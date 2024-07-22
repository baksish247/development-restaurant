// components/NextTopLoader.js
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import NProgress from "@badrap/bar-of-progress";

const progress = new NProgress({
  size: 4,
  color: "#441029",
  className: "z-50",
  delay: 100,
});

const NextTopLoader = () => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => progress.start();
    const handleStop = () => progress.finish();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return null;
};

export default NextTopLoader;

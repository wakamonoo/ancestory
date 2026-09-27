"use client";
import Contributors from "@/components/layout/home/contributors";
import Discover from "@/components/layout/home/discover";
import Featured from "@/components/layout/home/featured";
import Hero from "@/components/layout/home/hero";
import Places from "@/components/layout/home/places";
import { useLoader } from "@/context/loaderContext";
import { useEffect } from "react";

export default function Page() {
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="divide-y-4 divide-(--color-panel)">
      <Hero />
      <Featured />
      <Discover />
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
        <Places />
        <Contributors />
      </div>
    </div>
  );
}

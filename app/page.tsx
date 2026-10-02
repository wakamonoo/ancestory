"use client";
import About from "@/components/layout/home/about";
import Contributors from "@/components/layout/home/contributors";
import Discover from "@/components/layout/home/discover";
import Featured from "@/components/layout/home/featured";
import Footer from "@/components/layout/home/footer";
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
    <>
      <div className="p-8 md:px-16 lg:px-32 xl:px-64 mt-8 md:mt-0 divide-y divide-(--color-accent)/10">
        <Hero />
        <Featured />
        <Discover />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
          <Places />
          <Contributors />
        </div>
      </div>
      <About />
      <div className="p-8 md:px-16 lg:px-32 xl:px-64">
        <Footer />
      </div>
    </>
  );
}

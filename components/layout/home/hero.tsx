"use client";
import HeroImg from "@/assets/hero-img.png"
import RegularButton from "@/components/buttons/regularButton";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="w-full pb-8 pt-24 md:pb-0 md:pt-0 md:min-h-screen md:flex md:items-center">
      <div className="flex flex-col md:flex-row md:items-stretch md:gap-16 w-full">
        <div className="flex flex-col justify-center gap-8 w-full md:w-2/5">
          <p className="font-alt font-semibold text-muted uppercase text-base">
            Local Stories. Lasting Impressions.
          </p>
          <h1 className="font-bold text-5xl leading-none">
            preserving the stories that might otherwise disappear.
          </h1>
          <p className="text-base text-muted font-semibold">
            AnceStory is a growing collection of local stories, folklore,
            memories, and history told by the people who lived them, and the
            ones who still remember.
          </p>
          <div className="w-fit">
            <RegularButton
              onClick={() => {
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <p className="text-brand font-bold uppercase">
                Explore the archive
              </p>
              <FaArrowRight className="text-base text-brand shrink-0" />
            </RegularButton>
          </div>
        </div>
        <div className="mt-8 md:mt-0 w-full md:w-3/5">
          <Image
            src={HeroImg}
            alt="hero"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

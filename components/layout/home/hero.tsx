"use client";
import HeroImg from "@/assets/hero-img.png"
import RegularButton from "@/components/buttons/regularButton";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="home-hero w-full pt-28 pb-12 md:pt-32 md:pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:gap-14 w-full">
        <div className="flex flex-col justify-center gap-6 w-full md:w-[42%] py-6">
          <p className="eyebrow font-alt font-semibold text-muted uppercase text-sm">
            Local Stories. Lasting Impressions.
          </p>
          <h1 className="font-bold text-5xl md:text-6xl xl:text-7xl leading-[.95] tracking-tight">
            Preserving the stories that might otherwise disappear.
          </h1>
          <p className="max-w-lg text-base md:text-lg text-muted leading-relaxed">
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
        <div className="hero-image mt-8 md:mt-0 w-full md:w-[58%] aspect-[4/3] md:aspect-[1.15/1] overflow-hidden">
          <Image
            src={HeroImg}
            alt="hero"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

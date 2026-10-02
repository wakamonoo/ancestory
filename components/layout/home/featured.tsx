"use client";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";
import { LuBookOpen, LuMapPin } from "react-icons/lu";
import mayon from "@/assets/mayon.webp";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/loaderContext";
import EmptyStories from "@/components/fallbacks/emptyStories";
import FeaturedStoryLoader from "@/components/loaders/featuredStoryLoader";
import RegularButton from "@/components/buttons/regularButton";
import { BsClock } from "react-icons/bs";
import { Story } from "@/types/story";
import TransparentButton from "@/components/buttons/transparentButton";

export default function Featured() {
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const getFeaturedStory = async () => {
      try {
        const rest = await fetch("/api/stories/getFeaturedStory");
        const data = await rest.json();

        setFeaturedStory(data.story);
      } catch (err) {
        console.error("failed to fetch featured story", err);
        setFeaturedStory(null);
      } finally {
        setFeaturedLoading(false);
      }
    };
    getFeaturedStory();
  }, []);

  return (
    <div className="py-16">
      <p className="font-alt font-semibold uppercase text-base text-brown tracking-widest">
        Featured Story
      </p>
      {featuredLoading ? (
        <FeaturedStoryLoader />
      ) : !featuredStory ? (
        <EmptyStories />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] items-start w-full gap-2 md:gap-8 mt-4">
          <div className="w-full aspect-21/9">
            <img
              src={featuredStory.poster}
              alt={featuredStory.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full flex flex-col">
            <div className="my-2 md:mt-0">
              <h1 className="text-4xl text-normal">{featuredStory.title}</h1>
            </div>
            <div className="my-4 flex flex-wrap gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">
                <LuMapPin className="text-sm text-muted shrink-0" />
                <p className="text-sm text-muted font-alt">
                  {featuredStory.place}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BsClock className="text-sm text-muted shrink-0" />
                <p className="text-sm text-muted">
                  {featuredStory.readingTime > 1
                    ? `${featuredStory.readingTime} mins read`
                    : `${featuredStory.readingTime} min read`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 my-2">
              {featuredStory.categories?.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-second rounded"
                >
                  <p className="text-brown text-xs font-semibold font-alt uppercase">
                    {category}
                  </p>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-(--color-accent)/10 my-2" />
            <p className="text-base text-muted leading-tight line-clamp-3 my-2">
              {featuredStory.story}
            </p>

            <div className="my-4">
              <TransparentButton
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/stories/${featuredStory.storyId}`);
                }}
              >
                <p className="text-accent text-sm font-bold uppercase transition-all duration-200 group-hover:text-(--color-brown)">
                  Read Story
                </p>
                <FaArrowRight className="text-accent text-sm shrink-0 transition-all duration-200 group-hover:text-(--color-brown)/80" />
              </TransparentButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

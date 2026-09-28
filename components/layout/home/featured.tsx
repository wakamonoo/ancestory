"use client";
import { FaArrowRight } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/buttons/secondaryButton";
import { useLoader } from "@/context/loaderContext";
import EmptyStories from "@/components/fallbacks/emptyStories";
import FeaturedStoryLoader from "@/components/loaders/featuredStoryLoader";

type Story = {
  storyId: string;
  userId: string;
  title: string;
  place: string;
  poster: string;
  story: string;
  categories: string[];
  source?: string;
  createdAt: string;
};

export default function Featured() {
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const getFeaturedStory = async () => {
      setFeaturedLoading(true);
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
    <div className="py-8">
      {featuredLoading ? (
        <FeaturedStoryLoader />
      ) : !featuredStory ? (
        <EmptyStories />
      ) : (
        <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:gap-10">
          <div className="hidden aspect-[4/3] overflow-hidden rounded-sm md:block md:w-2/5 lg:w-1/3">
            <img
              src={featuredStory.poster}
              alt={featuredStory.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-3 py-2">
            <p className="font-alt font-semibold uppercase text-base text-muted">
              Featured Story
            </p>
            <div className="w-full flex gap-2">
              {featuredStory.categories?.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-muted">·</span>}
                  <p className="text-brown text-sm uppercase font-alt">
                    {category}
                  </p>
                </div>
              ))}
            </div>
            <h1 className="text-4xl font-bold">{featuredStory.title}</h1>
            <div className="flex items-center gap-2">
              <LuMapPin className="text-base text-muted shrink-0" />
              <p className="text-sm text-brown font-alt">
                {featuredStory.place}
              </p>
            </div>
            <p className="text-base text-muted leading-tight line-clamp-3 lg:line-clamp-5 mt-2">
              {featuredStory.story}
            </p>
            <div className="mt-4">
              <SecondaryButton
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/stories/${featuredStory.storyId}`);
                }}
              >
                <p className="text-brown text-base font-bold uppercase transition-all duration-200 group-hover:text-(--color-muted)">
                  Read Story
                </p>
                <FaArrowRight className="text-brown text-base shrink-0 transition-all duration-200 group-hover:text-(--color-muted)" />
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

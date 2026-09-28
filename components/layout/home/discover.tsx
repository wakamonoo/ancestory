"use client";
import mayon from "@/assets/mayon.webp";
import SecondaryButton from "@/components/buttons/secondaryButton";
import EmptyStories from "@/components/fallbacks/emptyStories";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import { spawn } from "child_process";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import StoryCard from "../story/storyCard";

export default function Discover() {
  const { stories, storiesLoading } = useStory();
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  return (
    <div id="discover" className="w-full gap-2 py-16">
      <div className="flex flex-col">
        <div className="w-full flex justify-between">
         <p className="font-alt font-semibold uppercase text-base text-brown">
            From the archive
          </p>
          {stories.length > 0 && (
            <SecondaryButton
              onClick={() => {
                setIsLoading(true);
                router.push("/stories");
              }}
            >
              <p className="text-brown font-bold uppercase text-sm transition-all duration-200 group-hover:text-(--color-muted)">
                View all
              </p>
              <FaArrowRight className="text-brown text-sm transition-all duration-200 group-hover:text-(--color-muted)" />
            </SecondaryButton>
          )}
        </div>

        {storiesLoading ? (
          <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StoryCardLoader />
            <StoryCardLoader />
          </div>
        ) : stories.length === 0 ? (
          <EmptyStories />
        ) : (
          <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stories.slice(0, visibleCount).map((story) => {
              return <StoryCard key={story.storyId} story={story} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

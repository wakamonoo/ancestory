"use client";
import mayon from "@/assets/mayon.webp";
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
import TransparentButton from "@/components/buttons/transparentButton";

export default function Discover() {
  const { stories, storiesLoading } = useStory();
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
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
        <p className="font-alt font-semibold uppercase text-base text-brown tracking-widest">
          From the archive
        </p>
        <h1 className="text-lg leading-tight">Stories from Every Corner.</h1>
        <p className="text-base text-muted mt-2">
          Discover stories from different places, people, and generations, each
          offering a glimpse into the places they come from.
        </p>

        {storiesLoading ? (
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
            <StoryCardLoader />
            <StoryCardLoader />
          </div>
        ) : stories.length === 0 ? (
          <EmptyStories />
        ) : (
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
            {stories.slice(0, visibleCount).map((story) => {
              return <StoryCard key={story.storyId} story={story} />;
            })}
          </div>
        )}
        <div className="mt-8 flex justify-end">
          {stories.length > 0 && (
            <TransparentButton
              onClick={() => {
                setIsLoading(true);
                router.push("/stories");
              }}
            >
              <p className="text-accent font-bold uppercase text-sm transition-all duration-200 group-hover:text-(--color-brown)">
                View all
              </p>
              <FaArrowRight className="text-accent text-sm transition-all duration-200 group-hover:text-(--color-brown)" />
            </TransparentButton>
          )}
        </div>
      </div>
    </div>
  );
}

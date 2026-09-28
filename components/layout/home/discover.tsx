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
        setVisibleCount(1);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  return (
    <div id="discover" className="w-full gap-2 py-8">
      <div className="flex flex-col">
        <p className="font-alt font-semibold uppercase text-base text-muted">
          From the archive
        </p>
        <div className="flex flex-col md:flex-row w-full md:justify-between">
          <h1 className="text-2xl font-bold">Discover Stories</h1>
          {stories.length > 0 && (
            <SecondaryButton
              onClick={() => {
                setIsLoading(true);
                router.push("/stories");
              }}
            >
              <p className="text-brown font-bold uppercase text-sm transition-all duration-200 group-hover:text-(--color-muted)">
                View all stories
              </p>
              <FaArrowRight className="text-brown text-sm transition-all duration-200 group-hover:text-(--color-muted)" />
            </SecondaryButton>
          )}
        </div>

        {storiesLoading ? (
          <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StoryCardLoader />
          </div>
        ) : stories.length === 0 ? (
          <EmptyStories />
        ) : (
          <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stories.slice(0, visibleCount).map((story) => {
              return (
                <div
                  key={story.storyId}
                  onClick={() => {
                    setIsLoading(true);
                    router.push(`/stories/${story.storyId}`);
                  }}
                  className="flex flex-row md:flex-col items-center md:items-start gap-2 p-2 cursor-pointer transition-all duration-200 rounded hover:bg-(--color-secondary) hover:shadow-lg"
                >
                  <img
                    src={story.poster}
                    alt={story.title}
                    className="w-1/2 md:w-full aspect-3/2 object-cover"
                  />
                  <div className="min-w-0 w-full px-2 flex flex-col gap-2">
                    <h4 className=" text-2xl leading-none font-semibold">
                      {story.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <LuMapPin className="text-sm text-muted shrink-0" />
                      <p className="text-sm text-muted truncate">
                        {story.place}
                      </p>
                    </div>

                    <div className="h-px w-full bg-brown" />
                    <p className="text-xs text-muted">
                      {story.readingTime > 1
                        ? `${story.readingTime} mins read`
                        : `${story.readingTime} min read`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

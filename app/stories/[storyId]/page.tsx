"use client";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import { Story } from "@/types/story";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiArrowBack, BiArrowToRight } from "react-icons/bi";
import { BsClock, BsPerson } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { GoPerson } from "react-icons/go";
import { LuArrowLeft, LuArrowRight, LuMapPin } from "react-icons/lu";

type StoryNav = {
  storyId: string;
  title: string;
  place: string;
};

export default function StoryPage() {
  const { storyId } = useParams();
  const { allUsers } = useUser();
  const { stories } = useStory();
  const [story, setStory] = useState<Story | null>(null);
  const [previousStory, setPreviousStory] = useState<StoryNav | null>(null);
  const [nextStory, setNextStory] = useState<StoryNav | null>(null);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const getStory = async () => {
      try {
        const res = await fetch(`/api/stories/getStories/story/${storyId}`);

        if (!res.ok) {
          throw new Error("failed to fetch story");
        }

        const data = await res.json();

        setStory(data.story);
        setPreviousStory(data.previous);
        setNextStory(data.next);
      } catch (err) {
        console.error(err);
        setStory(null);
        setPreviousStory(null);
        setNextStory(null);
      }
    };

    getStory();
  }, [storyId]);

  if (!story) return null;

  const contributor = allUsers.find((u) => u.uid === story.userId);

  const publishedStories = stories.filter(
    (s) => s.userId === contributor?.uid,
  ).length;

  return (
    <div className="w-full py-16 grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] lg:gap-8 items-start">
      <div>
        <div className="relative w-full aspect-video">
          <img
            src={story.poster}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-(--color-bg) via-(--color-bg)/0 to-transparent" />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-accent) active:bg-(--color-accent)"
            >
              <LuArrowLeft className="text-xs text-accent transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
            </button>
            <p className="text-xs text-accent font-semibold uppercase">Back</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            {story.categories?.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted">·</span>}
                <p className="text-brown text-xs font-semibold font-alt uppercase">
                  {category}
                </p>
              </div>
            ))}
          </div>
          <div className="my-4">
            <h1 className="text-4xl">{story.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-4">
            <div className="flex items-center gap-2">
              <LuMapPin className="text-sm text-muted shrink-0" />
              <p className="text-sm text-muted">{story.place}</p>
            </div>
            <div className="flex items-center gap-2">
              <BsClock className="text-sm text-muted shrink-0" />
              <p className="text-sm text-muted">
                {story.readingTime > 1
                  ? `${story.readingTime} mins read`
                  : `${story.readingTime} min read`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GoPerson className="text-sm text-muted shrink-0" />
              <p className="text-sm text-muted">{contributor?.name}</p>
            </div>
          </div>

          <div className="my-8">
            <p className="story-content text-base leading-loose whitespace-pre-line text-left">
              {story.story}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="my-4 flex gap-4 items-center border-y border-panel py-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={contributor?.profilePicture}
              alt={contributor?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm font-alt text-muted uppercase font-semibold">
              Contributor
            </p>
            <p className="text-base text-normal font-semibold">
              {contributor?.name}
            </p>
            <p className="text-xs text-muted">
              {publishedStories > 1
                ? `${publishedStories} Stories`
                : `${publishedStories} Story`}
            </p>
          </div>
        </div>
        <div className="my-4 flex justify-between items-start">
          {previousStory && (
            <div className="flex flex-col items-start">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() =>
                    router.push(`/stories/${previousStory?.storyId}`)
                  }
                  className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-muted) active:bg-(--color-muted)"
                >
                  <LuArrowLeft className="text-xs text-muted  transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
                </button>
                <p className="text-xs text-muted">Previous</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-base leading-none">{previousStory?.title}</p>
                <span className="text-xs text-muted">
                  {previousStory?.place}
                </span>
              </div>
            </div>
          )}
          {nextStory && (
            <div className="ml-auto flex flex-col items-end">
              <div className="flex gap-2 items-center">
                <p className="text-xs text-muted">Next</p>
                <button
                  onClick={() => router.push(`/stories/${nextStory?.storyId}`)}
                  className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-muted) active:bg-(--color-muted)"
                >
                  <LuArrowRight className="text-xs text-muted  transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
                </button>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-base leading-none">{nextStory?.title}</p>
                <span className="text-xs text-muted">{nextStory?.place}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

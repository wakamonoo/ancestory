"use client";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import { Story } from "@/types/story";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import PageSkeleton from "@/components/loaders/pageSkeleton";

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
  const [storyLoading, setStoryLoading] = useState(true);
  const [previousStory, setPreviousStory] = useState<StoryNav | null>(null);
  const [nextStory, setNextStory] = useState<StoryNav | null>(null);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const getStory = async () => {
      setStoryLoading(true);
      setStory(null);
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
      } finally {
        setStoryLoading(false);
      }
    };

    getStory();
  }, [storyId]);

  if (storyLoading) return <PageSkeleton variant="story" />;
  if (!story) return <div className="mx-auto max-w-3xl py-24 text-center"><p className="eyebrow text-xs uppercase text-muted">The archive</p><h1 className="mt-3 text-4xl font-bold">This story isn’t available</h1><button onClick={() => router.push("/stories")} className="mt-6 text-accent underline underline-offset-4">Return to stories</button></div>;

  const contributor = allUsers.find((u) => u.uid === story.userId);

  const publishedStories = stories.filter(
    (s) => s.userId === contributor?.uid,
  ).length;

  return (
    <article className="mx-auto w-full max-w-6xl py-12 md:py-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-muted) active:bg-(--color-muted)"
        >
          <LuArrowLeft className="text-xs text-muted  transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
        </button>
        <p className="text-xs text-muted uppercase">Back</p>
      </div>
      <div className="py-4">
        <div className="flex flex-wrap items-center gap-2">
          {story.categories?.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted">·</span>}
              <p className="text-brown text-sm font-alt uppercase">
                {category}
              </p>
            </div>
          ))}
          <span className="text-sm text-muted">|</span>
          <p className="text-sm text-brown font-alt uppercase">{story.place}</p>
        </div>
        {story.source && (
          <p className="text-xs text-muted">From: {story.source}</p>
        )}
        <h1 className="max-w-4xl text-4xl md:text-6xl font-bold my-4 leading-[1.02]">{story.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BsClock className="text-sm text-muted" />
            <p className="text-sm text-muted">
              {" "}
              {story.readingTime > 1
                ? `${story.readingTime} mins read`
                : `${story.readingTime} min read`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GoPerson className="text-sm text-muted" />
            <p className="text-sm text-muted">{contributor?.name}</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-8 md:my-12">
          <div className="w-full aspect-16/8 md:aspect-16/12">
            <img
              src={story.poster}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="max-w-prose text-base md:text-lg leading-relaxed text-muted whitespace-pre-line">
              {story.story}
            </p>
          </div>
        </div>
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
    </article>
  );
}

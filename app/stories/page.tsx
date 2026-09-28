"use client";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LuArrowLeft, LuMapPin } from "react-icons/lu";
import EmptyStories from "@/components/fallbacks/emptyStories";

export default function Stories() {
  const { stories, storiesLoading } = useStory();
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="w-full py-12 md:py-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-muted) active:bg-(--color-muted)"
        >
          <LuArrowLeft className="text-xs text-muted  transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
        </button>
        <p className="text-xs text-muted uppercase">Back</p>
      </div>

      <div className="page-intro mt-5">
        <p className="eyebrow text-xs font-semibold uppercase text-muted">The archive</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold">Stories from home</h1>
        <p className="mt-2 max-w-2xl text-muted">Folklore, memories, and local history, preserved in the words of the people who know them.</p>
      </div>
      {storiesLoading ? (
        <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }, (_, index) => <StoryCardLoader key={index} />)}
        </div>
      ) : stories.length === 0 ? <EmptyStories /> : (
        <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {stories.map((story) => {
            return (
              <div
                key={story.storyId}
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/stories/${story.storyId}`);
                }}
                className="story-card flex flex-col items-start gap-3 p-3 cursor-pointer rounded-sm"
              >
                <img
                  src={story.poster}
                  alt={story.title}
                  className="w-full aspect-3/2 object-cover"
                />
                <div className="min-w-0 w-full px-2 flex flex-col gap-2">
                  <h4 className=" text-2xl leading-none font-semibold">
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <LuMapPin className="text-sm text-muted shrink-0" />
                    <p className="text-sm text-muted truncate">{story.place}</p>
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
  );
}

"use client";
import StoryCard from "@/components/layout/story/storyCard";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Stories() {
  const { stories, storiesLoading } = useStory();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="w-full p-8 md:px-16 lg:px-32 xl:px-64 py-16">
      <div className="mt-4">
        <h1 className="text-2xl">All Stories</h1>
        <p className="text-base text-muted mt-2">
          Browse through our collection of local stories, folklore, memories,
          and history from different places and communities.
        </p>
        <div className="h-px w-full bg-(--color-accent)/10 my-8" />
        <div className="mt-4w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {storiesLoading ? (
            <>
              <StoryCardLoader />
              <StoryCardLoader />
              <StoryCardLoader />
            </>
          ) : (
            stories.map((story) => {
              return <StoryCard key={story.storyId} story={story} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}

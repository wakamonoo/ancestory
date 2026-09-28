"use client";
import EmptyUserStories from "@/components/fallbacks/emptyUserStories";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";
import StoryCard from "../story/storyCard";

export default function UserStories() {
  const { userStories, userStoriesLoading } = useStory();

  return (
    <div className="w-full">
      {userStoriesLoading ? (
        <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <StoryCardLoader />
        </div>
      ) : userStories.length === 0 ? (
        <EmptyUserStories />
      ) : (
        <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {userStories.map((story) => {
            return (
              <StoryCard key={story.storyId} story={story} />
            );
          })}
        </div>
      )}
    </div>
  );
}

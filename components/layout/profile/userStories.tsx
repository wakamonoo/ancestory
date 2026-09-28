"use client";
import EmptyUserStories from "@/components/fallbacks/emptyUserStories";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";

export default function UserStories() {
  const { userStories, userStoriesLoading } = useStory();
  const { setIsLoading } = useLoader();
  const router = useRouter();

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

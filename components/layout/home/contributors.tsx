"use client";
import EmptyContributors from "@/components/fallbacks/emptyContributors";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";

export default function Contributors() {
  const { allUsers, allUsersLoading } = useUser();
  const { stories } = useStory();

  return (
    <div id="contributors" className="w-full gap-2 py-8">
      <p className="font-alt font-semibold uppercase text-base text-muted">
        Our Contributors
      </p>
      <h1 className="text-2xl font-bold">Real people. Shared stories.</h1>
      {allUsersLoading ? (
        <div className="mt-6 flex gap-5 overflow-hidden" aria-label="Loading contributors">
          {Array.from({ length: 5 }, (_, index) => <div key={index} className="flex shrink-0 flex-col items-center gap-3 animate-pulse"><div className="h-20 w-20 rounded-full bg-second" /><div className="h-3 w-20 rounded bg-second" /></div>)}
        </div>
      ) : allUsers.length === 0 ? (
        <EmptyContributors />
      ) : (
        <div className="p-4 flex gap-4 overflow-x-auto">
          {allUsers.map((contributor) => {
            const publishedStories = stories.filter(
              (s) => s.userId === contributor.uid,
            ).length;

            return (
              <div
                key={contributor.uid}
                className="flex shrink-0 flex-col items-center gap-3 text-center"
              >
                  <div className="w-20 h-20 shrink-0">
                  <img
                    src={contributor.profilePicture}
                    alt={contributor.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col items-start lg:items-center">
                  <p className="text-base font-semibold">{contributor.name}</p>
                  <span className="text-xs text-muted">
                    {publishedStories > 1
                      ? `${publishedStories} Stories`
                      : `${publishedStories} Story`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

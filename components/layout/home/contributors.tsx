"use client";
import EmptyContributors from "@/components/fallbacks/emptyContributors";
import ContributorLoader from "@/components/loaders/contributorLoader";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function Contributors() {
  const { allUsers, allUsersLoading } = useUser();
  const { stories } = useStory();
  const router = useRouter();
  const { setIsLoading } = useLoader();

  return (
    <div id="contributors" className="w-full gap-2 py-16">
      <p className="font-alt font-semibold uppercase text-base text-brown tracking-widest">
        Our Contributors
      </p>
      <h1 className="text-2xl">Real people. Shared stories.</h1>
      {allUsersLoading ? (
        <div className="mt-8 flex gap-4 overflow-x-auto">
          <ContributorLoader />
        </div>
      ) : allUsers.length === 0 ? (
        <EmptyContributors />
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto">
          {allUsers.map((contributor) => {
            const publishedStories = stories.filter(
              (s) => s.userId === contributor.uid,
            ).length;

            return (
              <div key={contributor.uid} className="flex items-center gap-2">
                <div
                  onClick={() => {
                    setIsLoading(true);
                    router.push(`/profile/${contributor.uid}`);
                  }}
                  className="cursor-pointer p-0.5 rounded-full border-2 border-accent"
                >
                  <div className="w-18 h-18 rounded-full border border-accent overflow-hidden shrink-0">
                    <img
                      src={contributor.profilePicture}
                      alt={contributor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p
                    onClick={() => {
                      setIsLoading(true);
                      router.push(`/profile/${contributor?.uid}`);
                    }}
                    className="cursor-pointer text-base"
                  >
                    {contributor.name}
                  </p>
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

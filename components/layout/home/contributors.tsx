"use client";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";

export default function Contributors() {
  const { allUsers } = useUser();
  const { stories } = useStory();

  return (
    <div id="contributors" className="w-full gap-2 py-8">
      <p className="font-alt font-semibold uppercase text-base text-muted">
        Our Contributors
      </p>
      <h1 className="text-2xl font-bold">Real people. Shared stories.</h1>
      <div className="p-4 flex gap-4 overflow-x-auto">
        {allUsers.map((contributor) => {
          const publishedStories = stories.filter(
            (s) => s.userId === contributor.uid,
          ).length;

          return (
            <div
              key={contributor.uid}
              className="flex flex-row lg:flex-col items-center gap-2"
            >
              <div className="w-24 h-24 shrink-0">
                <img
                  src={contributor.picture}
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
    </div>
  );
}

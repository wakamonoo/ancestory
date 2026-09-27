"use client";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useContext,
} from "react";

type Story = {
  storyId: string;
  userId: string;
  title: string;
  place: string;
  location: {
    latitude: number;
    longitude: number;
  };
  poster: string;
  story: string;
  categories: string[];
  source?: string;
  readingTime: number;
  createdAt: string;
};

type StoryContextType = {
  stories: Story[];
};

export const StoryContext = createContext<StoryContextType | undefined>(
  undefined,
);

export const useStory = () => {
  const context = useContext(StoryContext);

  if (!context) {
    throw new Error("useStory must be used with StoryProvider");
  }

  return context;
};

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const handleGetStories = async () => {
      try {
        const res = await fetch("/api/stories/getStories", {
          method: "GET",
        });

        const data = await res.json();
        setStories(data.result);
      } catch (err) {
        console.error("failed to fetch stories", err);
        setStories([]);
      }
    };

    handleGetStories();
  }, []);

  return (
    <StoryContext.Provider value={{ stories }}>
      {children}
    </StoryContext.Provider>
  );
};

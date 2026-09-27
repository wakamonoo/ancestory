"use client";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useContext,
} from "react";
import { useUser } from "./userContext";
import { Story } from "@/types/story";

type StoryContextType = {
  stories: Story[];
  userStories: Story[];
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
  const [userStories, setUserStories] = useState<Story[]>([]);
  const { user } = useUser();

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

  useEffect(() => {
    const getStory = async () => {
      try {
        const res = await fetch(`/api/stories/getStories/user/${user?.uid}`);

        if (!res.ok) {
          throw new Error("failed to fetch story");
        }

        const data = await res.json();

        setUserStories(data.story);
      } catch (err) {
        console.error(err);
        setUserStories([]);
      }
    };

    getStory();
  }, [user?.uid]);

  return (
    <StoryContext.Provider value={{ stories, userStories }}>
      {children}
    </StoryContext.Provider>
  );
};

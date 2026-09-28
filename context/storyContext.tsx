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
  storiesLoading: boolean;
  userStoriesLoading: boolean;
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
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [userStoriesLoading, setUserStoriesLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleGetStories = async () => {
      setStoriesLoading(true);
      try {
        const res = await fetch("/api/stories/getStories", {
          method: "GET",
        });

        const data = await res.json();
        setStories(data.result);
      } catch (err) {
        console.error("failed to fetch stories", err);
        setStories([]);
      } finally {
        setStoriesLoading(false);
      }
    };

    handleGetStories();
  }, []);

  useEffect(() => {
    const getStory = async () => {
      setUserStoriesLoading(true);
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
      } finally {
        setUserStoriesLoading(false);
      }
    };

    getStory();
  }, [user?.uid]);

  return (
    <StoryContext.Provider
      value={{ stories, userStories, storiesLoading, userStoriesLoading }}
    >
      {children}
    </StoryContext.Provider>
  );
};

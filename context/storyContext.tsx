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
import AddStoryModal from "@/components/modals/addStoryModal";

type StoryContextType = {
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  fetchStories: () => Promise<void>;
  userStories: Story[];
  fetchUserStories: (uid: string) => Promise<void>;
  storiesLoading: boolean;
  userStoriesLoading: boolean;
  setShowAddStoryModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [userStoriesLoading, setUserStoriesLoading] = useState(true);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);

  const fetchStories = async () => {
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

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchUserStories = async (uid: string) => {
    setUserStoriesLoading(true);
    try {
      const res = await fetch(`/api/stories/getStories/user/${uid}`);

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

  return (
    <StoryContext.Provider
      value={{
        stories,
        setStories,
        fetchStories,
        userStories,
        fetchUserStories,
        storiesLoading,
        userStoriesLoading,
        setShowAddStoryModal,
      }}
    >
      {showAddStoryModal && (
        <AddStoryModal setShowAddStoryModal={setShowAddStoryModal} />
      )}
      {children}
    </StoryContext.Provider>
  );
};

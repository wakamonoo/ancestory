"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaPenFancy,
  FaPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import AddStoryModal from "../modals/addStoryModal";
import { useUser } from "@/context/userContext";
import MenuButton from "../buttons/menuButton";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/loaderContext";
import { useStory } from "@/context/storyContext";

type MaxMenuOptionsProps = {
  setShowMaxMenuOptions: (value: boolean) => void;
  maxMenuOptionsButtonRef: React.RefObject<HTMLButtonElement | null>;
};

export default function MaxMenuOptionsOptions({
  setShowMaxMenuOptions,
  maxMenuOptionsButtonRef,
}: MaxMenuOptionsProps) {
  const { user, setShowSignInModal } = useUser();
  const { setShowAddStoryModal } = useStory();
  const { setIsLoading } = useLoader();
  const divRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleOutClick(e: PointerEvent) {
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        maxMenuOptionsButtonRef.current &&
        !maxMenuOptionsButtonRef.current.contains(e.target as Node)
      ) {
        setShowMaxMenuOptions(false);
      }
    }
    document.addEventListener("pointerdown", handleOutClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutClick);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="absolute top-12 right-0 bg-brand h-fit w-[20vw] border border-(--color-accent)/10 bg-second rounded-lg shadow-2xl p-2 z-150"
    >
      <div className="flex flex-col gap-4">
        {user ? (
          <MenuButton
            onClick={() => {
              if (user) {
                setIsLoading(true);
                setShowMaxMenuOptions(false);
                router.push(`/profile/${user?.uid}`);
              } else {
                setShowSignInModal(true);
              }
            }}
          >
            <img
              src={user?.profilePicture}
              alt={user?.name}
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col items-start">
              <p className="text-base">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </MenuButton>
        ) : (
          <MenuButton onClick={() => setShowSignInModal(true)}>
            <FaUser className="text-base shrink-0" />
            <p className="text-base text-normal">Profile</p>
          </MenuButton>
        )}
        <div className="h-px w-full bg-(--color-accent)/10" />
        <div className="flex flex-col gap-2">
          <MenuButton
            onClick={() => {
              if (user) {
                setShowMaxMenuOptions(false);
                setShowAddStoryModal(true);
              } else {
                setShowSignInModal(true);
              }
            }}
          >
            <FaPlus className="text-sm" />
            <p className="text-sm">Add a Story</p>
          </MenuButton>
          {user ? (
            <MenuButton onClick={() => setShowSignInModal(true)}>
              <FaSignOutAlt className="text-sm" />
              <p className="text-sm muted">Sign out</p>
            </MenuButton>
          ) : (
            <MenuButton onClick={() => setShowSignInModal(true)}>
              <FaSignInAlt className="text-sm" />
              <p className="text-sm">Sign In</p>
            </MenuButton>
          )}
        </div>
      </div>
    </div>
  );
}

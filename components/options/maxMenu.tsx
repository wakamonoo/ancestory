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

type MaxMenuProps = {
  setShowMaxMenu: (value: boolean) => void;
  maxMenuButtonRef: React.RefObject<HTMLButtonElement | null>;
  setShowAddStoryModal: (value: boolean) => void;
};

export default function MaxMenu({
  setShowMaxMenu,
  maxMenuButtonRef,
  setShowAddStoryModal,
}: MaxMenuProps) {
  const { user, setShowSignInModal } = useUser();
  const { setIsLoading } = useLoader();
  const divRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleOutClick(e: PointerEvent) {
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        maxMenuButtonRef.current &&
        !maxMenuButtonRef.current.contains(e.target as Node)
      ) {
        setShowMaxMenu(false);
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
      className="absolute top-12 right-0 bg-brand h-fit w-[20vw] p-4 rounded-lg shadow-2xl z-150"
    >
      <div className="flex flex-col gap-4">
        {user ? (
          <MenuButton
            onClick={() => {
              if (user) {
                setIsLoading(true);
                setShowMaxMenu(false);
                router.push(`/profile/${user?.uid}}`);
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
        <div className="w-full h-px bg-panel" />
        <div className="flex flex-col gap-2">
          <MenuButton
            onClick={() => {
              if (user) {
                setShowMaxMenu(false);
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
              <p className="text-sm">Sign out</p>
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

import logo from "@/assets/mayon.webp";
import { useEffect, useRef, useState } from "react";
import {
  FaInfoCircle,
  FaMapPin,
  FaPenFancy,
  FaPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { LuBook, LuLink } from "react-icons/lu";
import AddStoryModal from "../modals/addStoryModal";
import MenuButton from "../buttons/menuButton";
import { useUser } from "@/context/userContext";
import { useNavigation } from "@/context/navigationContext";

type MinMenuProps = {
  setShowMinMenu: (value: boolean) => void;
  minMenuButtonRef: React.RefObject<HTMLButtonElement | null>;
  setShowAddStoryModal: (value: boolean) => void;
};

export default function MinMenu({
  setShowMinMenu,
  minMenuButtonRef,
  setShowAddStoryModal,
}: MinMenuProps) {
  const { user, setShowSignInModal } = useUser();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { handleStoriesClick, handlePlacesClick, handleContributorsClick } =
    useNavigation();

  useEffect(() => {
    function handleOutClick(e: PointerEvent) {
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        minMenuButtonRef.current &&
        !minMenuButtonRef.current.contains(e.target as Node)
      ) {
        setShowMinMenu(false);
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
      className="absolute top-12 right-0 bg-brand h-fit w-[80vw] p-4 rounded-lg shadow-md z-150"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <MenuButton onClick={handleStoriesClick}>
            <LuBook className="text-sm" />
            <p className="text-sm">Stories</p>
          </MenuButton>
          <MenuButton onClick={handlePlacesClick}>
            <FaMapPin className="text-sm" />
            <p className="text-sm">Places</p>
          </MenuButton>
          <MenuButton onClick={handleContributorsClick}>
            <LuLink className="text-sm" />
            <p className="text-sm">Contributors</p>
          </MenuButton>
        </div>
        <div className="w-full h-px bg-panel" />
        <div className="flex flex-col">
          {user && (
            <>
              <div className="flex gap-2 items-center">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-base">{user?.name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
              </div>
              <div className="w-full h-px bg-panel" />
            </>
          )}
          <div className="ml-10 mt-2 flex-col gap-2 hidden">
            <MenuButton>
              <FaUser className="text-sm" />
              <p className="text-sm">Profile</p>
            </MenuButton>
            <MenuButton>
              <FaPenFancy className="text-sm" />
              <p className="text-sm">My Stories</p>
            </MenuButton>
            <MenuButton
              onClick={() => {
                if (user) {
                  setShowMinMenu(false);
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
    </div>
  );
}

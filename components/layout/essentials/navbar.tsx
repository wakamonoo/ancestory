"use client";
import logo from "@/assets/logo.png";
import { FaBars, FaChevronDown, FaUser } from "react-icons/fa";
import { useRef, useState } from "react";
import Image from "next/image";
import MinMenu from "../../options/minMenu";
import MaxMenu from "../../options/maxMenu";
import { useUser } from "@/context/userContext";
import { useNavigation } from "@/context/navigationContext";
import AddStoryModal from "@/components/modals/addStoryModal";

export default function NavBar() {
  const { user, isLogged, isLoading: userLoading } = useUser();
  const [showMinMenu, setShowMinMenu] = useState(false);
  const [showMaxMenu, setShowMaxMenu] = useState(false);
  const {
    handleHomeClick,
    handleStoriesClick,
    handlePlacesClick,
    handleContributorsClick,
  } = useNavigation();
  const minMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const maxMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 -mx-5 sm:-mx-8 lg:-mx-14 flex justify-between items-center px-5 sm:px-8 lg:px-14 h-[4.5rem] border-b border-(--color-border) bg-(--color-bg)/95 backdrop-blur-md">
        <button onClick={handleHomeClick} className="cursor-pointer">
          <div className="w-32 h-auto">
            <Image src={logo} alt="AnceStory" />
          </div>
        </button>

        <div className="flex items-center gap-8 lg:gap-14">
          <div className="hidden lg:flex lg:gap-10">
            <button
              onClick={handleStoriesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Stories
              </p>
            </button>
            <button
              onClick={handlePlacesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Places
              </p>
            </button>
            <button
              onClick={handleContributorsClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Contributors
              </p>
            </button>
          </div>
          <div className="relative">
            <button
              ref={minMenuButtonRef}
              onClick={() => setShowMinMenu((prev) => !prev)}
              className="cursor-pointer block lg:hidden"
            >
              <FaBars className="text-2xl shrink-0" />
            </button>
            {showMinMenu && (
              <MinMenu
                setShowMinMenu={setShowMinMenu}
                minMenuButtonRef={minMenuButtonRef}
                setShowAddStoryModal={setShowAddStoryModal}
              />
            )}
          </div>
          <div className="relative hidden lg:flex">
            <button
              ref={maxMenuButtonRef}
              onClick={() => setShowMaxMenu((prev) => !prev)}
              className="cursor-pointer flex items-center gap-2"
            >
              {userLoading ? (
                <span className="skeleton h-7 w-7 rounded-full" aria-label="Loading account" />
              ) : isLogged ? (
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  loading="lazy"
                  decoding="async"
                  className="w-6 h-6 object-cover rounded-full"
                />
              ) : <FaUser />}
              <FaChevronDown className="text-sm" />
            </button>
            {showMaxMenu && (
              <MaxMenu
                setShowMaxMenu={setShowMaxMenu}
                maxMenuButtonRef={maxMenuButtonRef}
                setShowAddStoryModal={setShowAddStoryModal}
              />
            )}
          </div>
        </div>
      </div>
      {showAddStoryModal && (
        <AddStoryModal setShowAddStoryModal={setShowAddStoryModal} />
      )}
    </>
  );
}

"use client";
import logo from "@/assets/logo.png";
import { FaBars, FaChevronDown, FaSearch, FaUser } from "react-icons/fa";
import { useRef, useState } from "react";
import Image from "next/image";
import MinMenu from "../../options/minMenu";
import MaxMenu from "../../options/maxMenu";
import SignInModal from "@/components/modals/signInModal";
import { useUser } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";
import { useLoader } from "@/context/loaderContext";
import { useNavigation } from "@/context/navigationContext";
import AddStoryModal from "@/components/modals/addStoryModal";

export default function NavBar() {
  const { user, isLogged } = useUser();
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
      <div className="fixed z-9999 w-full flex justify-between items-center py-4 px-8 md:px-16 h-14 bg-brand">
        <button onClick={handleHomeClick} className="cursor-pointer">
          <div className="w-32 h-auto">
            <Image src={logo} alt="AnceStory" />
          </div>
        </button>

        <div className="flex items-center gap-24">
          <div className="hidden lg:flex lg:gap-16">
            <button
              onClick={handleStoriesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 group-hover:text-(--color-muted)">
                Stories
              </p>
            </button>
            <button
              onClick={handlePlacesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 group-hover:text-(--color-muted)">
                Places
              </p>
            </button>
            <button
              onClick={handleContributorsClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 group-hover:text-(--color-muted)">
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
              {isLogged ? (
                <img
                  src={user?.picture}
                  alt={user?.name}
                  loading="lazy"
                  decoding="async"
                  className="w-6 h-6 object-cover rounded-full"
                />
              ) : (
                <FaUser />
              )}
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

"use client";
import Logo from "@/assets/main_logo.png";
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
import { MdClose } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import UserIconLoader from "@/components/loaders/userIconLoader";

export default function NavBar() {
  const { user, isLogged, isLoading } = useUser();
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
      <div className="fixed z-9999 w-full flex justify-between items-center py-4 px-4 md:px-8 lg:px-16 h-14 bg-brand">
        <button onClick={handleHomeClick} className="cursor-pointer">
          <div className="w-32 h-auto">
            <Image src={Logo} alt="AnceStory" className="w-full h-full object-contain" />
          </div>
        </button>

        <div className="flex items-center justify-center gap-16">
          <div className="hidden lg:flex lg:gap-16">
            <button
              onClick={handleStoriesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-accent group-hover:text-(--color-brown)">
                Stories
              </p>
            </button>
            <button
              onClick={handlePlacesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-accent group-hover:text-(--color-brown)">
                Places
              </p>
            </button>
            <button
              onClick={handleContributorsClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-accent group-hover:text-(--color-brown)">
                Contributors
              </p>
            </button>
          </div>
          <div>
            <div className="relative">
              <button
                ref={minMenuButtonRef}
                onClick={() => setShowMinMenu((prev) => !prev)}
                className="cursor-pointer block lg:hidden"
              >
                {showMinMenu ? (
                  <FaXmark className="text-2xl shrink-0" />
                ) : (
                  <FaBars className="text-2xl shrink-0" />
                )}
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
                {isLogged && user?.profilePicture ? (
                  isLoading ? (
                    <UserIconLoader />
                  ) : (
                    <img
                      src={user?.profilePicture}
                      alt={user?.name}
                      loading="lazy"
                      decoding="async"
                      className="w-6 h-6 object-cover rounded-full"
                    />
                  )
                ) : (
                  <FaUser className="text-sm text-normal" />
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
      </div>

      {showAddStoryModal && (
        <AddStoryModal setShowAddStoryModal={setShowAddStoryModal} />
      )}
    </>
  );
}

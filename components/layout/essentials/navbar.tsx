"use client";
import Logo from "@/assets/main_logo.png";
import { FaBars, FaChevronDown, FaSearch, FaUser } from "react-icons/fa";
import { useRef, useState } from "react";
import Image from "next/image";
import SignInModal from "@/components/modals/signInModal";
import { useUser } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";
import { useLoader } from "@/context/loaderContext";
import { useNavigation } from "@/context/navigationContext";
import AddStoryModal from "@/components/modals/addStoryModal";
import { MdClose } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import UserIconLoader from "@/components/loaders/userIconLoader";
import MaxMenuOptions from "@/components/options/maxMenuOptions";
import MinMenuOptions from "@/components/options/minMenuOptions";
import { useStory } from "@/context/storyContext";

export default function NavBar() {
  const { user, isLogged, isLoading } = useUser();
  const [showMinMenuOptions, setShowMinMenuOptions] = useState(false);
  const [showMaxMenuOptions, setShowMaxMenuOptions] = useState(false);
  const {
    handleHomeClick,
    handleDiscoverClick,
    handlePlacesClick,
    handleContributorsClick,
    handleAboutClick,
  } = useNavigation();
  const minMenuOptionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const maxMenuOptionsButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className="fixed z-100 w-full flex justify-between items-center p-8 md:px-16 lg:px-32 xl:px-64 h-14 bg-brand">
        <button onClick={handleHomeClick} className="cursor-pointer">
          <div className="w-32 h-auto">
            <Image
              src={Logo}
              alt="AnceStory"
              className="w-full h-full object-contain"
            />
          </div>
        </button>

        <div className="flex items-center justify-center gap-16">
          <div className="hidden lg:flex lg:gap-16">
            <button
              onClick={handleDiscoverClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-accent group-hover:text-(--color-brown)">
                Discover
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
            <button onClick={handleAboutClick} className="cursor-pointer group">
              <p className="text-sm font-semibold transition-all duration-200 text-accent group-hover:text-(--color-brown)">
                About
              </p>
            </button>
          </div>
          <div>
            <div className="relative">
              <button
                ref={minMenuOptionsButtonRef}
                onClick={() => setShowMinMenuOptions((prev) => !prev)}
                className="cursor-pointer block lg:hidden"
              >
                {showMinMenuOptions ? (
                  <FaXmark className="text-2xl shrink-0" />
                ) : (
                  <FaBars className="text-2xl shrink-0" />
                )}
              </button>
              {showMinMenuOptions && (
                <MinMenuOptions
                  setShowMinMenuOptions={setShowMinMenuOptions}
                  minMenuOptionsButtonRef={minMenuOptionsButtonRef}
                />
              )}
            </div>
            <div className="relative hidden lg:flex">
              <button
                ref={maxMenuOptionsButtonRef}
                onClick={() => setShowMaxMenuOptions((prev) => !prev)}
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
              {showMaxMenuOptions && (
                <MaxMenuOptions
                  setShowMaxMenuOptions={setShowMaxMenuOptions}
                  maxMenuOptionsButtonRef={maxMenuOptionsButtonRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

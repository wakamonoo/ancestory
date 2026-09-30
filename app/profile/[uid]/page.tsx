"use client";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import mayon from "@/assets/mayon.webp";
import { LuArrowLeft, LuMapPin } from "react-icons/lu";
import { useLoader } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import UserPlaces from "@/components/layout/profile/usePlaces";
import UserStories from "@/components/layout/profile/userStories";
import { useEffect, useState } from "react";
import SecondaryButton from "@/components/buttons/secondaryButton";
import { FaPencil } from "react-icons/fa6";
import RegularButton from "@/components/buttons/regularButton";
import ActionButton from "@/components/buttons/actionButton";
import EditProfileModal from "@/components/modals/editProfileModal";
import Cover from "@/assets/cover.png";
import EmptyUserStories from "@/components/fallbacks/emptyUserStories";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import ConfirmAccountDeleteModal from "@/components/modals/confirmAccountDeleteModal";

export default function UserProfile() {
  const { user } = useUser();
  const { userStories, userStoriesLoading } = useStory();
  const { setIsLoading } = useLoader();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showConfirmAccountDeleteModal, setShowConfirmAccountDeleteModal] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="w-full py-16">
        <div className="relative">
          <div className="relative min-h-64 max-h-84 overflow-hidden">
            <img
              src={user?.coverPhoto || Cover.src}
              alt={user?.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-(--color-bg) via-(--color-bg)/80 to-transparent" />
            <div className="relative flex items-center gap-4 min-h-64 max-h-84 px-8">
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden">
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-base text-normal font-bold">{user?.name}</p>
                {user?.bio && (
                  <p className="text-sm text-muted italic">{user?.bio}</p>
                )}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-normal font-semibold">
                      {userStories.length}
                    </p>
                    <span className="text-xs text-normal">Stories</span>
                  </div>
                  <div className="h-8 w-px bg-(--color-accent)/10" />
                  <p className="text-sm text-normal font-semibold">
                    Joined {new Date(user?.createdAt ?? "").getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-2  flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="cursor-pointer group rounded-full p-2 transition-all duration-200 hover:bg-(--color-accent) active:bg-(--color-accent)"
            >
              <LuArrowLeft className="text-base text-accent transition-all duration-200 group-hover:text-(--color-secondary) group-active:text-(--color-secondary) shrink-0" />
            </button>
            <p className="text-xs text-accent font-semibold uppercase">Back</p>
          </div>
          <div className="absolute top-4 right-2">
            <ActionButton onClick={() => setShowEditProfileModal(true)}>
              <FaPencil className="text-base text-muted shrink-0" />
              <p className="text-muted font-bold">Edit</p>
            </ActionButton>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[3fr_1fr] items-stretch gap-4 lg:gap-8">
          <div>
            <p className="font-alt font-semibold uppercase text-base text-brown">
              Your Curated Stories
            </p>
            <UserStories />
          </div>
          <div>
            <p className="font-alt font-semibold uppercase text-base text-brown">
              Your AnceStory Map
            </p>
            <UserPlaces />
          </div>
        </div>
      </div>
      {showEditProfileModal && (
        <EditProfileModal
          setShowEditProfileModal={setShowEditProfileModal}
          setShowConfirmAccountDeleteModal={setShowConfirmAccountDeleteModal}
        />
      )}
      {showConfirmAccountDeleteModal && user && (
        <ConfirmAccountDeleteModal
          accountToDelete={user}
          setShowConfirmAccountDeleteModal={setShowConfirmAccountDeleteModal}
        />
      )}
    </>
  );
}

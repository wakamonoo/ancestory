"use client";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import mayon from "@/assets/mayon.webp";
import { LuMapPin } from "react-icons/lu";
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

export default function UserProfile() {
  const { user } = useUser();
  const { userStories } = useStory();
  const { setIsLoading } = useLoader();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="w-full py-16">
        <div className="relative">
          <div className="relative min-h-72 overflow-hidden">
            <img
              src={user?.coverPhoto}
              alt={user?.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-(--color-bg) via-(--color-bg)/80 to-transparent" />
            <div className="relative flex items-center gap-4 min-h-72 px-8">
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
                    <span className="text-xs text-muted">Stories</span>
                  </div>
                  <div className="h-8 w-px bg-panel" />
                  <p className="text-sm text-normal font-semibold">
                    Joined {new Date(user?.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-10">
            <ActionButton onClick={() => setShowEditProfileModal(true)}>
              <FaPencil className="text-base text-muted shrink-0" />
              <p className="text-muted font-bold">Edit</p>
            </ActionButton>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[3fr_1fr] items-stretch gap-4">
          <div>
            <h1 className="text-base font-bold text-muted">
              Your Curated Stories
            </h1>
            <UserStories />
          </div>
          <div>
            <h1 className="text-base font-bold text-muted">
              Your AnceStory Map
            </h1>
            <UserPlaces />
          </div>
        </div>
      </div>
      {showEditProfileModal && (
        <EditProfileModal setShowEditProfileModal={setShowEditProfileModal} />
      )}
    </>
  );
}

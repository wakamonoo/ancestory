"use client";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import { useLoader } from "@/context/loaderContext";
import UserPlaces from "@/components/layout/profile/usePlaces";
import UserStories from "@/components/layout/profile/userStories";
import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import ActionButton from "@/components/buttons/actionButton";
import EditProfileModal from "@/components/modals/editProfileModal";
import Cover from "@/assets/cover.png";
import PageSkeleton from "@/components/loaders/pageSkeleton";

export default function UserProfile() {
  const { user, isLoading: userLoading } = useUser();
  const { userStories } = useStory();
  const { setIsLoading } = useLoader();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (userLoading && !user) return <PageSkeleton variant="profile" />;

  return (
    <>
      <div className="w-full py-12 md:py-16">
        <div className="relative">
          <div className="profile-cover relative min-h-72 overflow-hidden rounded-sm">
            <img
              src={user?.coverPhoto || Cover.src}
              alt={user?.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-(--color-bg) via-(--color-bg)/80 to-transparent" />
            <div className="relative flex items-center gap-5 min-h-72 px-6 md:px-10">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden ring-4 ring-(--color-bg)">
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl text-normal font-bold">{user?.name || "Your profile"}</h1>
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
                  {user?.createdAt && <p className="text-sm text-normal font-semibold">Joined {new Date(user.createdAt).getFullYear()}</p>}
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
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[3fr_1fr] items-stretch gap-4 lg:gap-8">
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

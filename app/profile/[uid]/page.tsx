"use client";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import mayon from "@/assets/mayon.webp";
import { LuArrowLeft, LuMapPin } from "react-icons/lu";
import { useLoader } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import UserPlaces from "@/components/layout/profile/usePlaces";
import UserStories from "@/components/layout/profile/userStories";
import { useEffect, useState } from "react";
import SecondaryButton from "@/components/buttons/secondaryButton";
import { FaPencil } from "react-icons/fa6";
import RegularButton from "@/components/buttons/regularButton";
import ActionButton from "@/components/buttons/actionButton";
import EditProfileModal from "@/components/modals/editProfileModal";
import CoverFallback from "@/assets/coverFallback.png";
import EmptyUserStories from "@/components/fallbacks/emptyUserStories";
import StoryCardLoader from "@/components/loaders/storyCardLoader";
import ConfirmAccountDeleteModal from "@/components/modals/confirmAccountDeleteModal";
import { User } from "@/types/user";
import UserInfoLoader from "@/components/loaders/userInfoLoader";

export default function UserProfile() {
  const { uid } = useParams<{ uid: string }>();
  const { user } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileUserLoading, setProfileUserLoading] = useState(true);
  const { fetchUserStories, userStories } = useStory();
  const { setIsLoading } = useLoader();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showConfirmAccountDeleteModal, setShowConfirmAccountDeleteModal] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!uid) return;

    fetchUserStories(uid);
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const fetchProfileUser = async () => {
      try {
        const res = await fetch(`/api/users/userGet/${uid}`);

        if (!res.ok) {
          throw new Error("failed to fetch profile");
        }
        const data = await res.json();

        setProfileUser(data.result);
      } catch (err) {
        console.error("error fetching profile", err);
        setProfileUser(null);
      } finally {
        setProfileUserLoading(false);
      }
    };

    fetchProfileUser();
  }, [uid]);

  return (
    <>
      <div className="w-full  py-24">
        <div className="relative">
          <div className="relative min-h-64 max-h-84 overflow-hidden">
            <img
              src={profileUser?.coverPhoto || CoverFallback.src}
              alt={profileUser?.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-(--color-bg) via-(--color-bg)/40 to-transparent" />
            {profileUserLoading ? (
              <UserInfoLoader />
            ) : (
              <div className="relative p-8 md:px-16 lg:px-32 xl:px-64 flex items-center gap-4 min-h-64 max-h-84">
                <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden">
                  <img
                    src={profileUser?.profilePicture}
                    alt={profileUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-base text-normal font-bold">
                    {profileUser?.name}
                  </p>
                  {profileUser?.bio && (
                    <p className="text-sm text-brown italic">
                      {profileUser?.bio}
                    </p>
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
                      Joined{" "}
                      {new Date(profileUser?.createdAt ?? "").getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {profileUser?.uid === user?.uid && !profileUserLoading && (
            <div className="absolute top-4 right-2">
              <ActionButton onClick={() => setShowEditProfileModal(true)}>
                <FaPencil className="text-base text-normal shrink-0" />
                <p className="text-normal font-bold">Edit</p>
              </ActionButton>
            </div>
          )}
        </div>
        <div className="mt-4 p-8 md:px-16 lg:px-32 xl:px-64 grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] items-stretch gap-4 lg:gap-8">
          <div>
            <p className="font-alt font-semibold uppercase text-base text-brown">
              {profileUser?.uid === user?.uid
                ? "Your Curated Stories"
                : `${profileUser?.name}'s Curated Stories`}
            </p>
            <UserStories />
          </div>
          <div>
            <p className="font-alt font-semibold uppercase text-base text-brown">
              {profileUser?.uid === user?.uid
                ? "Your Ancestral Map"
                : `${profileUser?.name}'s Ancestral Map`}
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

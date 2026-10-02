import { useLoader } from "@/context/loaderContext";
import { useUser } from "@/context/userContext";
import { type FormEvent, useRef, useState } from "react";
import { LuImageUp } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import RegularButton from "../buttons/regularButton";
import Cover from "@/assets/cover.png";
import SecondaryButton from "../buttons/secondaryButton";

type EditProfileModalProps = {
  setShowEditProfileModal: (value: boolean) => void;
  setShowConfirmAccountDeleteModal: (value: boolean) => void;
};

export default function EditProfileModal({
  setShowEditProfileModal,
  setShowConfirmAccountDeleteModal,
}: EditProfileModalProps) {
  const { user, setUser, setAllUsers } = useUser();
  const [userName, setUserName] = useState(user?.name ?? "");
  const [userProfilePicture, setuserProfilePicture] = useState<string | File>(
    user?.profilePicture ?? "",
  );
  const [userCoverPhoto, setUserCoverPhoto] = useState<string | File>(
    user?.coverPhoto ?? "",
  );
  const [userBio, setUserBio] = useState(user?.bio ?? "");
  const profilePictureBtnRef = useRef<HTMLInputElement>(null);
  const coverPhotoBtnRef = useRef<HTMLInputElement>(null);
  const { setIsLoading } = useLoader();

  const hasChanges =
    userName !== user?.name ||
    userProfilePicture !== user?.profilePicture ||
    userCoverPhoto !== user?.coverPhoto ||
    userBio !== user?.bio;

  const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let profilePicture =
        typeof userProfilePicture === "string" ? userProfilePicture : "";

      let coverPhoto = typeof userCoverPhoto === "string" ? userCoverPhoto : "";

      if (userProfilePicture instanceof File) {
        const formData = new FormData();
        formData.append("file", userProfilePicture);

        const uploadRes = await fetch("/api/uploads/profilePictures", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();

          if (uploadRes.status === 413) {
            Swal.fire({
              toast: true,
              position: "bottom-start",
              title: "File too large, 50 MB maximum per file!",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
              background: "var(--color-secondary)",
              iconColor: "var(--color-accent)",
              customClass: {
                popup:
                  "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
                title:
                  "!text-base !font-semibold !text-(--color-text) !leading-4.5",
              },
            });
            return;
          }
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await uploadRes.json();
        profilePicture = data.url;
      }

      if (userCoverPhoto instanceof File) {
        const formData = new FormData();
        formData.append("file", userCoverPhoto);

        const uploadRes = await fetch("/api/uploads/coverPhotos", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();

          if (uploadRes.status === 413) {
            Swal.fire({
              toast: true,
              position: "bottom-start",
              title: "File too large, 50 MB maximum per file!",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
              background: "var(--color-secondary)",
              iconColor: "var(--color-accent)",
              customClass: {
                popup:
                  "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
                title:
                  "!text-base !font-semibold !text-(--color-text) !leading-4.5",
              },
            });
            return;
          }
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await uploadRes.json();
        coverPhoto = data.url;
      }

      await fetch(`/api/users/updateUser/${user?.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          profilePicture,
          coverPhoto,
          bio: userBio,
        }),
      });

      setUser((prev) => {
        if (!prev) return null;
        
        return {
          ...prev,
          name: userName,
          profilePicture,
          coverPhoto,
          bio: userBio,
        };
      });

      setAllUsers((prev) =>
        prev.map((u) =>
          u.uid === user?.uid
            ? {
                ...u,
                name: userName,
                profilePicture,
                coverPhoto,
                bio: userBio,
              }
            : u,
        ),
      );

      setShowEditProfileModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Profile updated",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-olive)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Something went wrong, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowEditProfileModal(false)}
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-(--color-accent)/10 bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-(--color-accent)/10 p-4">
          <h1 className="text-base font-semibold text-normal">Edit profile</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditProfileModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 group hover:bg-(--color-panel) shrink-0"
          >
            <MdClose className="text-xl text-normal transition-all duration-20 group-hover:text-(--color-accent)" />
          </button>
        </div>
        <div className="px-4">
          <form
            id="edit-profile-form"
            onSubmit={handleProfileChange}
            className="mt-4 flex flex-col w-full"
          >
            <div className="w-full h-32 relative shrink-0">
              <img
                src={
                  userCoverPhoto instanceof File
                    ? URL.createObjectURL(userCoverPhoto)
                    : userCoverPhoto || Cover.src
                }
                alt={userName}
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full rounded"
              />

              <button
                type="button"
                onClick={() => coverPhotoBtnRef.current?.click()}
                className="absolute flex items-center justify-center cursor-pointer bottom-1 right-1 bg-panel transition-all duration-200 hover:bg-(--color-panel)/80 active:bg-(--color-panel)/80 w-8 h-8 rounded-full p-2"
              >
                <LuImageUp className="text-muted text-2xl shrink-0" />
              </button>
              <input
                ref={coverPhotoBtnRef}
                type="file"
                accept="image/*"
                name="userImage"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setUserCoverPhoto(file);
                  }
                }}
                className="hidden"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-24 aspect-square relative shrink-0">
                <img
                  src={
                    userProfilePicture instanceof File
                      ? URL.createObjectURL(userProfilePicture)
                      : userProfilePicture
                  }
                  alt={userName}
                  loading="lazy"
                  decoding="async"
                  className="object-cover w-full h-full rounded-full"
                />

                <button
                  type="button"
                  onClick={() => profilePictureBtnRef.current?.click()}
                  className="absolute flex items-center justify-center cursor-pointer bottom-1 right-1 bg-panel transition-all duration-200 hover:bg-(--color-panel)/80 active:bg-(--color-panel)/80 w-8 h-8 rounded-full p-2"
                >
                  <LuImageUp className="text-muted text-2xl shrink-0" />
                </button>
                <input
                  ref={profilePictureBtnRef}
                  type="file"
                  accept="image/*"
                  name="userImage"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setuserProfilePicture(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-panel p-2 w-full rounded outline-none"
                />

                <textarea
                  name="userBio"
                  value={userBio}
                  onChange={(e) => {
                    if (e.target.value.length <= 160) {
                      setUserBio(e.target.value);
                    }
                  }}
                  placeholder="What should others know about you"
                  className="bg-panel p-2 w-full h-12 rounded outline-none"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="ml-auto flex w-fit gap-2 p-4">
          <SecondaryButton
            onClick={() => {
              setShowEditProfileModal(false);
              setShowConfirmAccountDeleteModal(true);
            }}
          >
            <p className="font-bold text-brand text-base whitespace-nowrap">
              Delete Account
            </p>
          </SecondaryButton>
          <RegularButton
            type="submit"
            disabled={!hasChanges}
            form="edit-profile-form"
          >
            <p className="font-bold text-brand text-base whitespace-nowrap">
              Submit Changes
            </p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
}

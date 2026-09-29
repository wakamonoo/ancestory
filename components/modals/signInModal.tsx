import { useUser } from "@/context/userContext";
import { googleSignUp } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { FcGoogle } from "react-icons/fc";
import { MdClose, MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import RoundedButton from "../buttons/roundedButton";

export default function SignInModal() {
  const { isLogged, setShowSignInModal } = useUser();

  const handleSignIn = async () => {
    if (isLogged) {
      await auth.signOut();
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "You've been logged out!",
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
      setShowSignInModal(false);
    } else {
      const { user, token, error } = await googleSignUp();
      if (error) {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "Sign in failed, please try again later!",
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
      }
      if (user && token) {
        try {
          const res = await fetch("api/users/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          });

          const data = await res.json();

          setShowSignInModal(false);
          Swal.fire({
            toast: true,
            position: "bottom-start",
            title: `Welcome, ${data.userName}`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-secondary)",
            iconColor: "var(--color-olive)",
            customClass: {
              popup:
                "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
              title:
                "!text-base !font-semibold !text-(--color-text) !leading-4.5",
            },
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            toast: true,
            position: "bottom-start",
            title: "Sign in failed, please try again later!",
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
        }
      }
    }
  };

  return (
    <div
      onClick={() => setShowSignInModal(false)}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSignInModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center px-4 pb-4">
          {isLogged ? (
            <RoundedButton onClick={handleSignIn}>
              <div className="flex gap-2 items-center justify-center">
                <p className="font-bold text-brand text-base">Logout Account</p>
                <MdLogout className="text-2xl text-brand shrink-0" />
              </div>
            </RoundedButton>
          ) : (
            <RoundedButton onClick={handleSignIn}>
              <div className="flex gap-2 items-center justify-center">
                <p className="font-bold text-brand text-base">
                  Continue with Google
                </p>
                <FcGoogle className="text-2xl shrink-0" />
              </div>
            </RoundedButton>
          )}
        </div>
      </div>
    </div>
  );
}

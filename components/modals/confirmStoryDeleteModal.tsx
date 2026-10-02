import { MdClose } from "react-icons/md";
import SecondaryButton from "../buttons/secondaryButton";
import RegularButton from "../buttons/regularButton";
import { Story } from "@/types/story";
import { useLoader } from "@/context/loaderContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useStory } from "@/context/storyContext";

type ConfirmStoryDeleteModalProps = {
  storyToDelete: Story;
  setShowConfirmStoryDeleteModal: (value: boolean) => void;
};

export default function ConfirmStoryDeleteModal({
  storyToDelete,
  setShowConfirmStoryDeleteModal,
}: ConfirmStoryDeleteModalProps) {
  const { setStories } = useStory();
  const { setIsLoading } = useLoader();
  const router = useRouter();

  const deleteStory = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/stories/deleteStory/${storyToDelete.storyId}`, {
        method: "DELETE",
      });

      setStories((prev) => prev.filter((story) => story.storyId !== storyToDelete.storyId))
      setShowConfirmStoryDeleteModal(false);

      router.back();

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Story succesfully deleted!",
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
      onClick={() => setShowConfirmStoryDeleteModal(false)}
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md  overflow-hidden rounded-2xl border border-(--color-accent)/10 bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-base font-semibold text-normal">Delete Story</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmStoryDeleteModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 group hover:bg-(--color-panel) shrink-0"
          >
            <MdClose className="text-xl text-normal transition-all duration-20 group-hover:text-(--color-accent)" />
          </button>
        </div>
        <div className="px-4">
          <p className="text-left text-base text-normal font-medium leading-5">
            Are you sure you want to delete this story?
          </p>
        </div>
        <div className="ml-auto flex w-fit gap-2 p-4">
          <SecondaryButton onClick={deleteStory}>
            <p className="font-bold text-brand text-base whitespace-nowrap">
              Confirm
            </p>
          </SecondaryButton>
          <RegularButton onClick={() => setShowConfirmStoryDeleteModal(false)}>
            <p className="font-bold text-brand text-base whitespace-nowrap">
              Cancel
            </p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
}

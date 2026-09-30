import { FaPen, FaTrash } from "react-icons/fa";
import MenuButton from "../buttons/menuButton";
import { useEffect, useRef } from "react";

type StoryOptionsProps = {
  storyOptionsButtonRef: React.RefObject<HTMLButtonElement | null>;
  setShowStoryOptions: (value: boolean) => void;
  setShowEditStoryModal: (value: boolean) => void;
  setShowConfirmStoryDeleteModal: (value: boolean) => void;
};

export default function StoryOptions({
  storyOptionsButtonRef,
  setShowStoryOptions,
  setShowEditStoryModal,
  setShowConfirmStoryDeleteModal,
}: StoryOptionsProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutClick(e: PointerEvent) {
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        storyOptionsButtonRef.current &&
        !storyOptionsButtonRef.current.contains(e.target as Node)
      ) {
        setShowStoryOptions(false);
      }
    }
    document.addEventListener("pointerdown", handleOutClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutClick);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="flex flex-col gap-2 absolute top-full right-0 w-60 border border-panel bg-second rounded-lg shadow-2xl p-2 z-150"
    >
      <MenuButton
        onClick={() => {
          setShowEditStoryModal(true);
          setShowStoryOptions(false);
        }}
      >
        <FaPen className="text-base shrink-0" />
        <p className="text-base font-medium">Edit Story</p>
      </MenuButton>

      <MenuButton
        onClick={() => {
          setShowConfirmStoryDeleteModal(true);
          setShowStoryOptions(false);
        }}
      >
        <FaTrash className="text-base shrink-0" />
        <p className="text-base font-medium">Delete Story</p>
      </MenuButton>
    </div>
  );
}

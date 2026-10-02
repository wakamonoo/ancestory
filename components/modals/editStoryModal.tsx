import { MdClose } from "react-icons/md";
import RegularButton from "../buttons/regularButton";
import { RiImage2Fill } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "@/context/userContext";
import { useLoader } from "@/context/loaderContext";
import LocationPicker from "./locationPickerModal";
import SecondaryButton from "../buttons/secondaryButton";
import { Story } from "@/types/story";

type EditStoryModalProps = {
  storyToEdit: Story;
  setShowEditStoryModal: (value: boolean) => void;
};

type Location = {
  latitude: number;
  longitude: number;
};

export default function EditStoryModal({
  storyToEdit,
  setShowEditStoryModal,
}: EditStoryModalProps) {
  const { user } = useUser();
  const [title, setTitle] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [location, setLocation] = useState<Location | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [story, setStory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setTitle(storyToEdit.title);
    setPlace(storyToEdit.place);
    setLocation(storyToEdit.location);
    setStory(storyToEdit.story ?? "");
    setCategories(storyToEdit.categories);
    setSource(storyToEdit.source);
  }, [storyToEdit]);

  useEffect(() => {
    const textarea = inputRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [story]);

  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };
  const readingTime = calculateReadingTime(story);

  const submitStory = async () => {
    setIsLoading(true);

    try {
      if (
        !title.trim() ||
        !place.trim() ||
        !story.trim() ||
        categories.length === 0
      ) {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "Please provide required fields!",
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

      let poster = storyToEdit.poster;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/uploads/storyPosters", {
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

        const { url } = await uploadRes.json();

        poster = url;
      }

      await fetch("/api/stories/updateStory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId: storyToEdit.storyId,
          userId: user?.uid,
          title,
          place,
          location,
          poster,
          story,
          categories,
          source,
          readingTime,
        }),
      });

      setShowEditStoryModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Story udpated!",
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
    <>
      <div
        onClick={() => setShowEditStoryModal(false)}
        className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-(--color-accent)/10 bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-(--color-accent)/10 p-4">
            <h1 className="text-base font-semibold text-normal">Edit Story</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditStoryModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 group hover:bg-(--color-panel) shrink-0"
            >
              <MdClose className="text-xl text-normal transition-all duration-20 group-hover:text-(--color-accent)" />
            </button>
          </div>
          <div className="px-4 overflow-y-auto custom-scroll">
            <div className="flex flex-wrap gap-4">
              <div className="py-2 flex flex-col flex-1">
                <h4>Title</h4>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give this story a title"
                  className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
                />
              </div>
              <div className="py-2 flex flex-col flex-1">
                <h4>Place</h4>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Where does this story from?"
                    className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
                  />
                  <SecondaryButton onClick={() => setShowLocationPicker(true)}>
                    <p className="font-bold text-brand text-base whitespace-nowrap">
                      {location ? "Change pin location" : "Pin location"}
                    </p>
                  </SecondaryButton>
                </div>
              </div>
              <img
                src={file ? URL.createObjectURL(file) : storyToEdit.poster}
                alt={storyToEdit.title}
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <label
                htmlFor="fileUpload"
                className="w-full cursor-pointer flex gap-4 items-center justify-center p-4 border border-dashed"
              >
                <RiImage2Fill className="text-4xl shrink-0" />
                <div className="flex flex-col justify-center items-start">
                  <p className="text-base font-bold">
                    {file ? file.name : "Change poster"}
                  </p>
                  <span className="text-xs text-muted">
                    (Maximum size of 50mb)
                  </span>
                </div>
              </label>
              <input
                id="fileUpload"
                name="file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] ?? null;
                  setFile(selectedFile);
                }}
              />
              <div className="py-2 flex flex-col w-full">
                <h4>Story</h4>
                <textarea
                  ref={inputRef}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Write your story here..."
                  rows={1}
                  style={{ maxHeight: "120px" }}
                  className="w-full resize-none overflow-y-auto rounded-lg text-normal outline-none text-base font-normal bg-panel p-2"
                />
              </div>
              <div className="py-2 flex flex-col flex-1">
                <h4>Source</h4>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Source material of this story"
                  className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
                />
              </div>
              <select
                multiple
                value={categories}
                onChange={(e) =>
                  setCategories(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value,
                    ),
                  )
                }
                className="w-full rounded-lg border border-(--color-accent)/10 bg-second p-2 custom-scroll"
              >
                <option
                  value=""
                  disabled
                  className="text-sm text-muted p-1 cursor-not-allowed"
                >
                  Select categories
                </option>
                <option
                  value="Local History"
                  className="text-sm text-normal p-1 cursor-pointer rounded hover:bg-(--color-bg) active:bg-(--color-bg)"
                >
                  Local History
                </option>
                <option
                  value="Culture & Tradition"
                  className="text-sm text-normal p-1 cursor-pointer rounded hover:bg-(--color-bg) active:bg-(--color-bg)"
                >
                  Culture & Tradition
                </option>
                <option
                  value="Folklore"
                  className="text-sm text-normal p-1 cursor-pointer rounded hover:bg-(--color-bg) active:bg-(--color-bg)"
                >
                  Folklore
                </option>
                <option
                  value="Other"
                  className="text-sm text-normal p-1 cursor-pointer rounded hover:bg-(--color-bg) active:bg-(--color-bg)"
                >
                  Other
                </option>
              </select>
            </div>
          </div>
          <div className="ml-auto flex w-fit p-4">
            <RegularButton onClick={submitStory}>
              <p className="font-bold text-brand text-base whitespace-nowrap">
                Save Changes
              </p>
            </RegularButton>
          </div>
        </div>
      </div>
      {showLocationPicker && (
        <LocationPicker
          location={location}
          setLocation={setLocation}
          setShowLocationPicker={setShowLocationPicker}
        />
      )}
    </>
  );
}

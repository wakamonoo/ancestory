import { useLoader } from "@/context/loaderContext";
import { Story } from "@/types/story";
import { useRouter } from "next/navigation";
import { BsClock } from "react-icons/bs";
import { LuMapPin } from "react-icons/lu";

type StoryCardProps = {
  story: Story;
};

export default function StoryCard({ story }: StoryCardProps) {
  const { setIsLoading } = useLoader();
  const router = useRouter();
  return (
    <div
      key={story.storyId}
      onClick={() => {
        setIsLoading(true);
        router.push(`/stories/${story.storyId}`);
      }}
      className="flex flex-row md:flex-col items-center md:items-start gap-2 cursor-pointer transition-all duration-200 rounded hover:overflow-hidden active:overflow-hidden hover:bg-(--color-secondary) active:bg-(--color-secondary) hover:shadow-lg active:shadow-lg"
    >
      <img
        src={story.poster}
        alt={story.title}
        className="w-1/2 md:w-full aspect-3/2 object-cover"
      />
      <div className="min-w-0 w-full p-2 flex flex-col gap-2">
        <h4 className=" text-2xl">{story.title}</h4>
        <div className="flex items-center gap-2">
          <LuMapPin className="text-sm text-muted shrink-0" />
          <p className="text-sm text-muted truncate">{story.place}</p>
        </div>

        <div className="h-px w-full bg-(--color-accent)/10" />
        <div className="flex items-center gap-2">
          <BsClock className="text-sm text-muted shrink-0" />
          <p className="text-sm text-muted">
            {story.readingTime > 1
              ? `${story.readingTime} mins read`
              : `${story.readingTime} min read`}
          </p>
        </div>
      </div>
    </div>
  );
}

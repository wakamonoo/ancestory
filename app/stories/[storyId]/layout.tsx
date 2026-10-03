import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getStory(storyId: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/stories/getStories/story/${storyId}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data.story;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storyId: string }>;
}): Promise<Metadata> {
  const { storyId } = await params;
  const story = await getStory(storyId);

  if (!story) {
    return {
      title: "Story Not Found",
      description: "This story could not be found on AnceStory.",
    };
  }

  return {
    title: story.title,
    description:
      story.story?.slice(0, 155) ||
      `Read ${story.title}, a local story preserved and shared through AnceStory`,
  };
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

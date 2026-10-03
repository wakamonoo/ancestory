import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getUser(uid: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/users/userGet/${uid}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data.result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> {
  const { uid } = await params;
  const user = await getUser(uid);

  if (!user) {
    return {
      title: "User Not Found",
      description: "This AnceStory profile could not be found.",
    };
  }

  return {
    title: user.name,
    description:
      user.bio?.slice(0, 155) ||
      `${user.name}'s profile on AnceStory, featuring their stories, memories, and contributions to local history.`,
  };
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

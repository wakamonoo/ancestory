import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Stories",
    template: "%s • AnceStory",
  },
  description:
    "Explore local stories, folklore, memories, and history shared by the people and communities who remember them.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

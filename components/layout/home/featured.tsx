"use client";
import { FaArrowRight } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import mayon from "@/assets/mayon.webp";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/buttons/secondaryButton";
import { useLoader } from "@/context/loaderContext";

type Story = {
  storyId: string;
  userId: string;
  title: string;
  place: string;
  poster: string;
  story: string;
  categories: string[];
  source?: string;
  createdAt: string;
};

export default function Featured() {
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const getFeaturedStory = async () => {
      const rest = await fetch("/api/stories/getFeaturedStory");
      const data = await rest.json();

      setFeaturedStory(data.story);
    };
    getFeaturedStory();
  }, []);

  if (!featuredStory) return null;

  return (
    <div className="py-8">
      <div className="flex w-full items-stretch gap-8">
        <div className="hidden md:block md:w-2/5 lg:w-1/3">
          <img
            src={featuredStory.poster}
            alt={featuredStory.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-2">
          <p className="font-alt font-semibold uppercase text-base text-muted">
            Featured Story
          </p>
          <div className="w-full flex gap-2">
            {featuredStory.categories?.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted">·</span>}
                <p className="text-brown text-sm uppercase font-alt">{category}</p>
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-bold">{featuredStory.title}</h1>
          <div className="flex items-center gap-2">
            <LuMapPin className="text-base text-muted shrink-0" />
            <p className="text-sm text-brown font-alt">{featuredStory.place}</p>
          </div>
          <p className="text-base text-muted leading-tight line-clamp-3 lg:line-clamp-5 mt-2">
            {featuredStory.story}
          </p>
          <div className="mt-4">
            <SecondaryButton
              onClick={() => {
                setIsLoading(true);
                router.push(`/stories/${featuredStory.storyId}`);
              }}
            >
              <p className="text-brown font-bold uppercase transition-all duration-200 group-hover:text-(--color-muted)">
                Read Story
              </p>
              <FaArrowRight className="text-brown text-base shrink-0 transition-all duration-200 group-hover:text-(--color-muted)" />
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

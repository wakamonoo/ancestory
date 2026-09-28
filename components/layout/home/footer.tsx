"use client";
import Logo from "@/assets/logo.png";
import RegularButton from "@/components/buttons/regularButton";
import { useNavigation } from "@/context/navigationContext";
import Image from "next/image";
import { useEffect } from "react";
import { SiKofi } from "react-icons/si";

declare global {
  interface Window {
    kofiwidget2: {
      init: (text: string, color: string, id: string) => void;
      getHTML: () => string;
    };
  }
}

export default function Footer() {
  const {
    handleHomeClick,
    handleStoriesClick,
    handlePlacesClick,
    handleContributorsClick,
  } = useNavigation();

  useEffect(() => {
    const container = document.getElementById("kofi-widget");

    if (!container) return;

    const script = document.createElement("script");

    script.src = "https://storage.ko-fi.com/cdn/widget/Widget_2.js";
    script.type = "text/javascript";
    script.onload = () => {
      if (window.kofiwidget2) {
        window.kofiwidget2.init(
          "Support AnceStory on Ko-fi",
          "#9a5c45",
          "U5F225NGUC",
        );

        container.innerHTML = window.kofiwidget2.getHTML();
      }
    };

    container.appendChild(script);

    return () => {
      script.remove();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="mt-16 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-8 md:gap-16 lg:gap-24">
          <button
            onClick={handleHomeClick}
            className="w-32 h-auto cursor-pointer"
          >
            <Image
              src={Logo}
              alt="logo"
              className="w-full h-full shrink-0 object-contain"
            />
          </button>
          <div className="flex flex-col items-start md:flex-row gap-2 md:gap-8 lg:gap-16">
            <button
              onClick={handleStoriesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Stories
              </p>
            </button>
            <button
              onClick={handlePlacesClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Places
              </p>
            </button>
            <button
              onClick={handleContributorsClick}
              className="cursor-pointer group"
            >
              <p className="text-sm font-semibold transition-all duration-200 text-muted group-hover:text-(--color-normal)">
                Contributors
              </p>
            </button>
          </div>
        </div>

        <div className="min-w-32">
          <div id="kofi-widget" />
        </div>
      </div>
      <div className="h-px w-full bg-(--color-accent)/10 my-4" />
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <h4 className="text-xs text-muted">Ancestral Stories, Local People.</h4>
        <p className="text-xs text-muted">{`© ${new Date().getFullYear()} AnceStory. All rights reserved.`}</p>
      </div>
    </div>
  );
}

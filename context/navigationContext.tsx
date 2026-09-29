"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useLoader } from "./loaderContext";
import { usePathname, useRouter } from "next/navigation";

type NavigationContextType = {
  handleHomeClick: () => void;
  handleStoriesClick: () => void;
  handlePlacesClick: () => void;
  handleContributorsClick: () => void;
};

type NavigationProviderProps = {
  children: ReactNode;
};

export const NavigationContext = createContext<NavigationContextType>({
  handleHomeClick: () => {},
  handleStoriesClick: () => {},
  handlePlacesClick: () => {},
  handleContributorsClick: () => {},
});

export const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used with NavigationProvider");
  }

  return context;
};

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = () => {
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      router.push("/");
    } else {
      setIsLoading(true);
      router.push("/");
    }
  };

  const handleStoriesClick = () => {
    if (pathname === "/") {
      document
        .getElementById("discover")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setIsLoading(true);
      router.push("/#discover");
    }
  };

  const handlePlacesClick = () => {
    if (pathname === "/") {
      document
        .getElementById("places")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setIsLoading(true);
      router.push("/#places");
    }
  };

  const handleContributorsClick = () => {
    if (pathname === "/") {
      document
        .getElementById("contributors")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setIsLoading(true);
      router.push("/#contributors");
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        handleHomeClick,
        handleStoriesClick,
        handlePlacesClick,
        handleContributorsClick,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

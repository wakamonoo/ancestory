"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import MainLoader from "@/components/loaders/mainLoader";

type LoaderContextType = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

type LoaderProviderProps = {
  children: ReactNode;
};

export const LoaderContext = createContext<LoaderContextType>({
  setIsLoading: () => {},
});

export const useLoader = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used with LoaderProvider");
  }

  return context;
};

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setIsLoading }}>
      {children}
      {isLoading && <MainLoader />}
    </LoaderContext.Provider>
  );
};

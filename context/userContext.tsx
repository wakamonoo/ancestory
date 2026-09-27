"use client";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useContext,
} from "react";
import SignInModal from "@/components/modals/signInModal";

type UserData = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  role?: string;
};

type UserContextType = {
  user: UserData | null;
  fetchUserData: (uid: string) => Promise<void>;
  firebaseUser: FirebaseUser | null;
  isLogged: boolean;
  isLoading: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
  allUsers: UserData[];
  allUsersLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used with UserProvided");
  }

  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState<boolean>(true);

  const fetchUserData = async (uid: string) => {
    try {
      const res = await fetch(`/api/users/userGet/${uid}`);

      if (!res.ok) {
        throw new Error("failed to fetch user data");
      }
      const data = await res.json();

      setUser(data.result);
      setIsLogged(true);
    } catch (err) {
      console.error("error fetching user data", err);
      setUser(null);
      setIsLogged(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: FirebaseUser | null) => {
        setIsLoading(true);
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          await fetchUserData(firebaseUser.uid);
        } else {
          setUser(null);
          setIsLogged(false);
        }
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/users/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setAllUsers(data.result);
      } catch (err) {
        console.error(err);
        setAllUsers([]);
      } finally {
        setAllUsersLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        fetchUserData,
        firebaseUser,
        isLogged,
        isLoading,
        setShowSignInModal,
        allUsers,
        allUsersLoading,
      }}
    >
      {children}
      {showSignInModal && <SignInModal />}
    </UserContext.Provider>
  );
};

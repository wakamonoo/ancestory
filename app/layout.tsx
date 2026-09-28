import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  DM_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";
import { StoryProvider } from "@/context/storyContext";
import NavBar from "@/components/layout/essentials/navbar";
import { LoaderProvider } from "@/context/loaderContext";
import { NavigationProvider } from "@/context/navigationContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmsans = DM_Sans({
  variable: "--font-alt",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-tall",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AnceStory | Local stories, lasting impressions",
  description: "A growing archive of local stories, folklore, memories, and history, shared by the people who remember.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${dmsans.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col">
        <UserProvider>
          <StoryProvider>
            <LoaderProvider>
              <NavigationProvider>
                <NavBar />
                <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 sm:px-8 lg:px-14">{children}</main>
              </NavigationProvider>
            </LoaderProvider>
          </StoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

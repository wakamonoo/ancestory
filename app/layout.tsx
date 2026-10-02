import type { Metadata } from "next";
import { Lora, Inter, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";
import { StoryProvider } from "@/context/storyContext";
import NavBar from "@/components/layout/essentials/navbar";
import { LoaderProvider } from "@/context/loaderContext";
import { NavigationProvider } from "@/context/navigationContext";

const lora = Lora({
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

// Metadata
export const metadata = {
  title: {
    default: "AnceStory • Local Stories, Lasting Impressions",
    template: "%s • AnceStory",
  },

  description:
    "Discover and preserve local stories, places, and memories with AnceStory. Explore stories from communities, learn about meaningful places, and share the experiences that shape local heritage.",

  keywords: [
    "AnceStory",
    "Local Stories",
    "Local History",
    "Community Stories",
    "Cultural Stories",
    "Local Heritage",
    "Cultural Heritage",
    "Community Heritage",
    "Philippine Stories",
    "Philippine Local History",
    "Philippine Heritage",
    "Bicol Stories",
    "Bicol Heritage",
    "Albay Stories",
    "Albay Heritage",
    "Community Memories",
    "Oral History",
    "Local Experiences",
    "Stories and Places",
    "Discover Local Stories",
  ],

  authors: [{ name: "Joven Bataller", url: "https://wakamonoo.site" }],

  creator: "Joven Bataller",
  publisher: "AnceStory",
  applicationName: "AnceStory",
  category: "Education",

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "iYKOhXEC4XjkkIKgKZzvAmLnQtaQsCHa8-HREmlTjU8",
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/icons/icon.png" },
      {
        url: "/icons/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/icon.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/icons/icon.png",
    shortcut: "/icons/icon.png",
  },

  openGraph: {
    title: "AnceStory • Local Stories, Lasting Impressions",
    description:
      "Discover and preserve local stories, places, and memories with AnceStory. Explore stories from communities, learn about meaningful places, and share the experiences that shape local heritage.",
    url: "https://ancestory.site",
    siteName: "AnceStory",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "/main_logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AnceStory • Local Stories, Lasting Impressions",
    description:
      "Discover and preserve local stories, places, and memories with AnceStory. Explore stories from communities, learn about meaningful places, and share the experiences that shape local heritage.",
    images: "/main_logo.png",
  },

  metadataBase: new URL("https://ancestory.site"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${dmsans.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <StoryProvider>
            <LoaderProvider>
              <NavigationProvider>
                <NavBar />
                {children}
              </NavigationProvider>
            </LoaderProvider>
          </StoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

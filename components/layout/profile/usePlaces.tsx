"use client";
import "leaflet/dist/leaflet.css";
import { useStory } from "@/context/storyContext";
import { useEffect, useRef } from "react";

export default function UserPlaces() {
  const { userStories, userStoriesLoading } = useStory();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      const L = await import("leaflet");

      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([13.2925, 123.4386], 10);

      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      userStories.forEach((story) => {
        if (!story.location) return;

        L.marker([story.location.latitude, story.location.longitude], {
          icon: markerIcon,
        })
          .addTo(map)
          .bindPopup(`<strong>${story.title}</strong>`);
      });
    };

    loadMap();

    return () => {
      cancelled = true;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [userStories]);

  return (
    <div className="w-full h-full">
      {userStoriesLoading ? <div className="skeleton mt-4 h-[40vh] w-full rounded-sm lg:h-full" aria-label="Loading profile map" /> : <div ref={mapRef} className="mt-4 h-[40vh] w-full overflow-hidden rounded-sm lg:h-full" />}
    </div>
  );
}

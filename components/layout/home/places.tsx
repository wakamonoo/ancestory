"use client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useStory } from "@/context/storyContext";
import { useEffect, useRef } from "react";

export default function Places() {
  const { stories } = useStory();
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

      stories.forEach((story) => {
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
  }, [stories]);

  return (
    <div id="places" className="w-full gap-2 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr]">
        <div className="flex flex-col">
          <p className="font-alt font-semibold uppercase text-base text-muted">
            Explore by place
          </p>
          <h1 className="text-2xl font-bold">Find stories from these places</h1>
          <p className="text-base text-muted mt-2">
            Each place has its own rhythm, people, and stories. Explore what
            makes them unique through the voices of those who call them home.
          </p>
        </div>
        <div ref={mapRef} className="h-[40vh] lg:h-[30vh] w-full mt-4" />
      </div>
    </div>
  );
}

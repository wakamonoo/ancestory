"use client";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import RegularButton from "../buttons/regularButton";

type Location = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  location: Location | null;
  setLocation: (location: Location) => void;
  setShowLocationPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LocationPicker({
  location,
  setLocation,
  setShowLocationPicker,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    location,
  );

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

      const map = L.map(mapRef.current).setView(
        selectedLocation
          ? [selectedLocation.latitude, selectedLocation.longitude]
          : [13.2925, 123.4386],
        10,
      );

      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      if (selectedLocation) {
        markerRef.current = L.marker(
          [selectedLocation.latitude, selectedLocation.longitude],
          { icon: markerIcon },
        ).addTo(map);
      }

      map.on("click", (e: any) => {
        const newLocation = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };

        setSelectedLocation(newLocation);

        if (markerRef.current) {
          markerRef.current.setLatLng([
            newLocation.latitude,
            newLocation.longitude,
          ]);
        } else {
          markerRef.current = L.marker(
            [newLocation.latitude, newLocation.longitude],
            { icon: markerIcon },
          ).addTo(map);
        }
      });
    };

    loadMap();

    return () => {
      cancelled = true;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      markerRef.current = null;
    };
  }, []);

  const handleConfirm = () => {
    if (!selectedLocation) return;

    setLocation(selectedLocation);
    setShowLocationPicker(false);
  };

  return (
    <div
      onClick={() => setShowLocationPicker(false)}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Pin Location</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLocationPicker(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto custom-scroll">
          <p>Click on the map to pinpoint where this story comes from.</p>
          <div ref={mapRef} className="h-400 w-full rounded-lg" />
          {selectedLocation && (
            <p className="mt-2 text-xs text-muted">
              {selectedLocation.latitude.toFixed(6)},{" "}
              {selectedLocation.longitude.toFixed(6)}
            </p>
          )}
        </div>
        <div className="flex border-t border-panel p-4">
          <RegularButton
            disabled={!selectedLocation}
            onClick={() => handleConfirm()}
          >
            <p className="font-bold text-brand text-base">Mark Location</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCreateJob } from "@/lib/zustand/CreateJobStore";
import axios from "axios";

const MapPicker = () => {
  const { setLocation, setLatitude, setLongitude } = useCreateJob();
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(true);

  // Custom marker icon
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Ambil lokasi user saat mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          fetchLocation(lat, lng);
          setLoading(false);
        },
        (err) => {
          console.log("Gagal ambil lokasi:", err);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Reverse geocoding pakai OpenCage
  const fetchLocation = async (lat: number, lng: number) => {
    try {
      const { data } = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${lat}+${lng}`,
            key: process.env.NEXT_PUBLIC_API_KEY_OPEN_CAGE,
          },
        }
      );
      const city =
        data.results[0]?.components.city ||
        data.results[0]?.components.town ||
        data.results[0]?.components.village ||
        "";
      setLocation(city);
    } catch (err) {
      console.log("Gagal reverse geocode:", err);
    }
  };

  // Component untuk handle klik map
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        fetchLocation(lat, lng);
      },
    });
    return null;
  }

  return (
    <div className="rounded-lg overflow-hidden mt-4">
      <MapContainer
        center={position}
        zoom={12}
        style={{
          height: "400px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        <Marker position={position} icon={customIcon} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;

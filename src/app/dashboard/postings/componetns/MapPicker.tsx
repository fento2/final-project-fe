"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import debounce from "lodash.debounce";

// Helper untuk update center map
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
};

interface IMapPicker {
  location: string;
  latitude: number;
  longitude: number;
  setLocation: (location: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
}

const MapPicker = ({
  location,
  latitude,
  longitude,
  setLatitude,
  setLocation,
  setLongitude,
}: IMapPicker) => {
  const defaultPosition: [number, number] = [-2.548926, 118.014863]; // tengah Indonesia
  const initialPosition: [number, number] =
    latitude && longitude ? [latitude, longitude] : defaultPosition;

  const [position, setPosition] = useState<[number, number]>(initialPosition);

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Reverse geocode: lat,lng -> city
  const fetchLocation = async (lat: number, lng: number) => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${process.env.NEXT_PUBLIC_API_KEY_OPEN_CAGE}`
      );
      // ambil komponen lokasi
      const components = data.results[0]?.components || {};

      // fallback: city → town → village
      const city =
        components.city || components.town || components.village || "";
      const country = components.country || "";

      setLocation(`${city}, ${country}`);
    } catch (err) {
    }
  };

  // Klik map update marker & store
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        setLatitude(lat);
        setLongitude(lng);
        fetchLocation(lat, lng);
      },
    });
    return null;
  }

  // Debounce geocoding dari nama lokasi
  const debouncedGeocode = debounce(async (loc: string) => {
    if (!loc) return;
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          loc
        )}&key=${process.env.NEXT_PUBLIC_API_KEY_OPEN_CAGE}`
      );
      const result = data.results[0];
      if (result) {
        const lat = result.geometry.lat;
        const lng = result.geometry.lng;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setPosition([lat, lng]); // pindahkan marker & map
      }
    } catch (err) {
    }
  }, 3000);

  // Pantau perubahan location dari store (misal user ketik di field)
  useEffect(() => {
    debouncedGeocode(location);
  }, [location]);

  return (
    <div className="rounded-2xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={12}
        style={{ height: 300, width: "100%" }}
      >
        <ChangeMapView center={position} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        <Marker position={position} icon={customIcon}>
          <Tooltip direction="top" offset={[0, -10]} permanent>
            {location || "Unknown"}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPicker;

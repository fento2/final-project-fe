"use client";
import { useEffect, useState } from 'react';

type Region = {
  loading: boolean;
  country: string | null;
  countryCode: string | null;
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  refresh: () => void;
};

export default function useUserRegion(): Region {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fallback() {
      // Try an IP-based lookup first (better than navigator.language when geolocation is blocked)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const cc = (data.country_code || '').toLowerCase() || undefined;
          const cname = data.country_name || undefined;
          const lat = data.latitude ? parseFloat(data.latitude) : null;
          const lon = data.longitude ? parseFloat(data.longitude) : null;
          if (!mounted) return;
          setCountry(cname ?? null);
          setCountryCode(cc ?? null);
          setLatitude(lat);
          setLongitude(lon);
          setLoading(false);
          setError(null);
          return;
        }
      } catch (e) {
        // ignore and fall through to navigator locale fallback
      }

      const lang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
      const parts = lang.split('-');
      const cc = parts.length > 1 ? parts[1].toLowerCase() : 'us';
      if (!mounted) return;
      setCountry(null);
      setCountryCode(cc);
      setLatitude(null);
      setLongitude(null);
      setLoading(false);
      setError(null);
    }

    setLoading(true);
    setError(null);

    if (!('geolocation' in navigator)) {
      // no geolocation support — attempt IP lookup then locale
      void fallback();
      return;
    }

    const onSuccess = async (pos: GeolocationPosition) => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Reverse geocode failed');
        const data = await res.json();
        const cc: string | undefined = data?.address?.country_code?.toLowerCase();
        const cname: string | undefined = data?.address?.country;
        if (!mounted) return;
        setCountry(cname ?? null);
        setCountryCode(cc ?? null);
        setLatitude(lat);
        setLongitude(lon);
        setLoading(false);
        setError(null);
        return;
      } catch (err: any) {
        if (!mounted) return;
        // if reverse geocode failed, try IP-based lookup
        await fallback();
      }
    };

    const onError = (err: GeolocationPositionError) => {
      // user denied or other error — try IP-based detection then navigator locale
      void fallback();
    };

    const watcher = navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });

    return () => {
      mounted = false;
      // getCurrentPosition doesn't return an id to clear, but mark mounted false
    };
  }, [tick]);

  return {
    loading,
    country,
    countryCode,
    latitude,
    longitude,
    error,
    refresh: () => setTick((t) => t + 1),
  };
}

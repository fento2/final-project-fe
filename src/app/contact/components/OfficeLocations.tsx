"use client";
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function OfficeLocations({ selected, setSelected }: { selected: number; setSelected: (i:number) => void }) {
    const mapRef = useRef<any | null>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            const L = (window as any).L;
            if (!L) return;

            mapRef.current = L.map('office-map', { zoomControl: false, attributionControl: false }).setView([37.7749, -122.4194], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapRef.current);

            const offices = [
                { id: 0, coords: [37.7837, -122.4090] },
                { id: 1, coords: [37.7749, -122.4194] },
                { id: 2, coords: [37.7925, -122.3930] },
            ];

            markersRef.current = offices.map((o) => {
                const marker = L.marker(o.coords, { riseOnHover: true }).addTo(mapRef.current);
                marker.on('click', () => setSelected(o.id));
                return { id: o.id, marker };
            });

            const group = L.featureGroup(markersRef.current.map((m) => m.marker));
            mapRef.current.fitBounds(group.getBounds().pad(0.3));
        };

        document.body.appendChild(script);

        return () => {
            if (mapRef.current) mapRef.current.remove();
            if (script.parentNode) script.parentNode.removeChild(script);
            if (link.parentNode) link.parentNode.removeChild(link);
        };
    }, [setSelected]);

    useEffect(() => {
        const mr = markersRef.current;
        // @ts-ignore
        const L = (window as any).L;
        if (!mr || !L || !mapRef.current) return;

        mr.forEach((m) => {
            if (m.id === selected) {
                const icon = L.divIcon({ className: 'custom-pin-filled', html: `<div style="width:18px;height:18px;border-radius:50%;background:#4f46e5;margin:auto;border:6px solid #4f46e5;"></div>` , iconSize: [18, 24], iconAnchor: [9, 24] });
                m.marker.setIcon(icon);
                mapRef.current.panTo(m.marker.getLatLng());
            } else {
                const icon = L.divIcon({ className: 'custom-pin-outline', html: `<div style="width:18px;height:18px;border-radius:50%;background:transparent;margin:auto;border:6px solid #6366f1;"></div>` , iconSize: [18, 24], iconAnchor: [9, 24] });
                m.marker.setIcon(icon);
            }
        });
    }, [selected]);

    return (
        <div>
            <div className="rounded-2xl h-80 mb-12 relative overflow-hidden">
                <div id="office-map" className="w-full h-80 rounded-2xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {[0,1,2].map((i) => (
                    <div key={i} className="group">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelected(i)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(i); }}
                            className={`bg-white rounded-2xl shadow-lg transition-all duration-300 cursor-pointer p-6 ${selected === i ? 'md:-translate-y-6 shadow-2xl' : 'md:translate-y-2 hover:shadow-2xl'}`}
                        >
                            <div className="flex justify-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selected === i ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-2 border-indigo-300'}`}>
                                    <MapPin className={`w-6 h-6 ${selected === i ? 'text-white' : 'text-indigo-600'}`} />
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl overflow-hidden">
                                <img src={i === 0 ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' : i === 1 ? 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt={`Office ${i+1}`} className="w-full h-48 object-cover rounded-lg" />
                            </div>

                            <h3 className="text-2xl font-extrabold text-indigo-900 mt-6 mb-2 text-center">{`Office ${i+1}`}</h3>
                            <p className="text-sm text-gray-500 text-center">123 Anywhere St., Any City, ST 12345</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

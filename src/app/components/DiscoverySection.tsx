"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Job {
    id: string | number;
    company: string;
    logo?: string;
    postedDate?: string;
    location?: string;
    salary?: string;
    title: string;
    type?: string;
    description?: string;
    lat?: number;
    lng?: number;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Haversine formula
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const DiscoverySection: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("Nearest");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null
    );

    useEffect(() => {
        // get user location
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    // permission denied or error - leave coords null and fallback
                    setCoords(null);
                }
            );
        }

        // use dummy data (no backend)
        const dummyJobs: Job[] = [
            { id: 1, company: "Creative Solutions, Inc.", logo: "/images/logo.png", postedDate: "2 days ago", location: "San Francisco, CA", salary: "90,000 - 120,000 per year", title: "Senior UI Designer", type: "Full Time", description: "Bachelor's degree in design or related. 5+ years of UI design.", lat: 37.7749, lng: -122.4194 },
            { id: 2, company: "Acme Corporation", logo: "/images/logo.png", postedDate: "5 days ago", location: "New York, NY", salary: "80,000 - 100,000 per year", title: "UI/UX Designer", type: "Full Time", description: "3+ years in UI/UX design.", lat: 40.7128, lng: -74.0060 },
            { id: 3, company: "App Works", logo: "/images/logo.png", postedDate: "1 day ago", location: "Los Angeles, CA", salary: "70,000 - 90,000 per year", title: "Mobile UI Designer", type: "Full Time", description: "Familiar with mobile design guidelines.", lat: 34.0522, lng: -118.2437 },
            { id: 4, company: "UXLabs Company", logo: "/images/logo.png", postedDate: "7 days ago", location: "Chicago, IL", salary: "100,000 - 130,000 per year", title: "Lead UI/UX Designer", type: "Full Time", description: "7+ years of experience leading design teams.", lat: 41.8781, lng: -87.6298 },
            { id: 5, company: "Interface Design Group", logo: "/images/logo.png", postedDate: "10 days ago", location: "Austin, TX", salary: "50,000 - 60,000 per year", title: "Junior UI Designer", type: "Full Time", description: "1+ years of experience in UI design.", lat: 30.2672, lng: -97.7431 },
            { id: 6, company: "Red Eye Studio", logo: "/images/logo.png", postedDate: "3 days ago", location: "Seattle, WA", salary: "60,000 - 80,000 per year", title: "Visual Designer", type: "Full Time", description: "Experience creating digital illustrations.", lat: 47.6062, lng: -122.3321 },
            { id: 7, company: "Tech Innovators", logo: "/images/logo.png", postedDate: "4 days ago", location: "Boston, MA", salary: "120,000 - 150,000 per year", title: "Lead Brand Designer", type: "Full Time", description: "8+ years of experience in visual design.", lat: 42.3601, lng: -71.0589 },
            { id: 8, company: "User Insight", logo: "/images/logo.png", postedDate: "6 days ago", location: "Portland, OR", salary: "80,000 - 100,000 per year", title: "UI/UX Researcher", type: "Full Time", description: "3+ years of experience in UX research.", lat: 45.5051, lng: -122.6750 },
        ];

        setJobs(dummyJobs);
    }, []);

    // compute sorted list by proximity if coords available
    const jobsSorted = React.useMemo(() => {
        if (!coords) return jobs;

        return [...jobs]
            .map((j) => {
                if (typeof j.lat === "number" && typeof j.lng === "number") {
                    // @ts-ignore
                    return { ...j, _distance: getDistanceKm(coords.lat, coords.lng, j.lat, j.lng) };
                }
                return { ...j, _distance: Infinity };
            })
            .sort((a: any, b: any) => (a._distance || Infinity) - (b._distance || Infinity));
    }, [coords, jobs]);

    // derive list of city names from job.location (take part before comma if present)
    const cities = React.useMemo(() => {
        const set = new Set<string>();
        jobs.forEach((j) => {
            if (!j.location) return;
            const city = j.location.split(",")[0].trim();
            if (city) set.add(city);
        });
        return ["Nearest", ...Array.from(set)];
    }, [jobs]);

    const displayedJobs = React.useMemo(() => {
        if (selectedCity === "Nearest") return jobsSorted;
        return jobs.filter((j) => {
            if (!j.location) return false;
            return j.location.toLowerCase().includes(selectedCity.toLowerCase());
        });
    }, [selectedCity, jobs, jobsSorted]);

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold">Job Near You</h2>

                    <div className="mt-4 inline-flex items-center bg-white rounded-full shadow px-4 py-2">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-transparent outline-none text-indigo-600 font-semibold cursor-pointer"
                        >
                            {cities.map((c) => (
                                <option key={c} value={c} className="text-sm">
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                        Showing jobs {selectedCity === 'Nearest' ? 'nearest to you' : `in ${selectedCity}`}. Allow location access for distance sorting.
                    </p>
                </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading && <p>Loading jobs…</p>}
                {!loading && displayedJobs.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">No jobs found.</p>
                )}

                {displayedJobs.slice(0, 8).map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl shadow p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    {job.logo ? (
                                        <Image src={job.logo} alt={job.company} width={40} height={40} className="object-contain" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">{job.company?.slice(0, 1)}</div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{job.title}</p>
                                        <p className="text-sm text-gray-500">{job.company}</p>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                    <p className="mb-1"><strong>{job.type || 'Full Time'}</strong></p>
                                    <p className="text-xs text-gray-400">{job.description?.slice(0, 80)}{job.description && job.description.length > 80 ? '…' : ''}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">{job.location}</p>
                                {coords && typeof (job as any)._distance === 'number' && isFinite((job as any)._distance) && (
                                    <p className="text-xs text-gray-400">{((job as any)._distance).toFixed(1)} km</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Apply This Job</button>
                            <button className="p-2 border rounded text-indigo-600">🔖</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <a className="text-sm underline text-gray-700">View All Popular Jobs</a>
            </div>
        </section>
    );
};

export default DiscoverySection;

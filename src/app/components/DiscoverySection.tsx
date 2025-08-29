"use client"
import React, { useEffect, useState } from "react";
import LocationSelector from "./LocationSelector";
import JobGrid from "./JobGrid";
import MobileJobCarousel from "./MobileJobCarousel";

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
    requirements?: string[];
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

const dummyJobs: Job[] = [

{ id: 1, company: "Creative Solutions, Inc.", logo: "/images/logo.png", postedDate: "2 days ago", location: "San Francisco, CA", salary: "90,000 - 120,000 per year", title: "Senior UI Designer", type: "Full Time", description: "Bachelor's degree in design or related. 5+ years of UI design.", requirements: ["Bachelor's degree in design or related", "5+ years of experience in UI design", "Proficiency in Adobe Creative Suite"], lat: 37.7749, lng: -122.4194 }, 

{ id: 2, company: "Acme Corporation", logo: "/images/logo.png", postedDate: "5 days ago", location: "New York, NY", salary: "80,000 - 100,000 per year", title: "UI/UX Designer", type: "Full Time", description: "3+ years in UI/UX design.", requirements: ["Bachelor's degree in design or related", "3+ years of experience in UI/UX design", "Experience with Sketch & Figma"], lat: 40.7128, lng: -74.0060 }, 

{ id: 3, company: "App Works", logo: "/images/logo.png", postedDate: "1 day ago", location: "Los Angeles, CA", salary: "70,000 - 90,000 per year", title: "Mobile UI Designer", type: "Full Time", description: "Familiar with mobile design guidelines.", requirements: ["Bachelor's degree in design or related", "2+ years of experience in UI design", "Familiar with mobile design guidelines"], lat: 34.0522, lng: -118.2437 }, 

{ id: 4, company: "UXLabs Company", logo: "/images/logo.png", postedDate: "7 days ago", location: "Chicago, IL", salary: "100,000 - 130,000 per year", title: "Lead UI/UX Designer", type: "Full Time", description: "7+ years of experience leading design teams.", requirements: ["Bachelor's degree in design or related", "7+ years of experience in UI/UX design", "Experience leading design teams"], lat: 41.8781, lng: -87.6298 }, 

{ id: 5, company: "Interface Design Group", logo: "/images/logo.png", postedDate: "10 days ago", location: "Austin, TX", salary: "50,000 - 60,000 per year", title: "Junior UI Designer", type: "Full Time", description: "1+ years of experience in UI design.", requirements: ["Bachelor's degree in design or related", "1+ years of experience in UI design", "Proficiency in design tools"], lat: 30.2672, lng: -97.7431 }, 

{ id: 6, company: "Red Eye Studio", logo: "/images/logo.png", postedDate: "3 days ago", location: "Seattle, WA", salary: "60,000 - 80,000 per year", title: "Visual Designer", type: "Full Time", description: "Experience creating digital illustrations.", requirements: ["Bachelor's degree in design or related", "Experience in visual design", "Digital illustration skills"], lat: 47.6062, lng: -122.3321 }, 

{ id: 7, company: "Tech Innovators", logo: "/images/logo.png", postedDate: "4 days ago", location: "Boston, MA", salary: "120,000 - 150,000 per year", title: "Lead Brand Designer", type: "Full Time", description: "8+ years of experience in visual design.", requirements: ["Bachelor's degree in design or related", "8+ years of experience in visual design", "Brand design expertise"], lat: 42.3601, lng: -71.0589 }, 

{ id: 8, company: "User Insight", logo: "/images/logo.png", postedDate: "6 days ago", location: "Portland, OR", salary: "80,000 - 100,000 per year", title: "UI/UX Researcher", type: "Full Time", description: "3+ years of experience in UX research.", requirements: ["Bachelor's degree in design or related", "3+ years of experience in UX research", "Research methodology knowledge"], lat: 45.5051, lng: -122.6750 }];
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
        <section className="max-w-max mx-auto px-6 py-16">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold">Job Near You</h2>
                <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                    Showing jobs {selectedCity === 'Nearest' ? 'nearest to you' : `in ${selectedCity}`}. Allow location access for distance sorting.
                </p>
                <LocationSelector 
                    cities={cities}
                    selectedCity={selectedCity}
                    onCityChange={setSelectedCity}
                />
            </div>

            {/* Mobile Carousel */}
            <div className="block lg:hidden">
                <MobileJobCarousel 
                    jobs={displayedJobs}
                    loading={loading}
                    coords={coords}
                    maxJobs={8}
                />
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:block">
                <JobGrid 
                    jobs={displayedJobs}
                    loading={loading}
                    coords={coords}
                    maxJobs={8}
                />
            </div>

            <div className="mt-8 text-center">
                <a className="text-sm underline text-gray-700">View All Popular Jobs</a>
            </div>
        </section>
    );
};

export default DiscoverySection;
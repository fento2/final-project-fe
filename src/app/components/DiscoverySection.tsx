"use client"
import React, { useEffect, useState } from "react";
import LocationSelector from "./LocationSelector";
import JobGrid from "./JobGrid";
import MobileJobCarousel from "./MobileJobCarousel";
import { useJobs } from "@/hooks/useJobs";

interface Job {
    id: string | number;
    company: string;
    logo?: string;
    postedDate?: string;
    location?: string;
    salary?: string | number | null;
    periodSalary?: string;
    currency?: string;
    title: string;
    type?: string;
    description?: string;
    requirements?: string[];
    lat?: number;
    lng?: number;
    slug?: string;
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
    const { jobs: apiJobs, loading: apiLoading, error: apiError } = useJobs({ limit: 50 });
    const [selectedCity, setSelectedCity] = useState<string>("Nearest");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null
    );

    // Convert API jobs to local Job type format
    const jobs: Job[] = React.useMemo(() => {
        if (!Array.isArray(apiJobs)) return [];
        
        // Debug: Log first job to check salary data structure
        if (apiJobs.length > 0) {
            const firstJob = apiJobs[0] as any;
            console.log('First job data from backend:', firstJob);
            console.log('Salary fields:', {
                salary: firstJob.salary,
                periodSalary: firstJob.periodSalary,
                currency: firstJob.currency,
                expected_salary: firstJob.expected_salary
            });
        }
        
        return apiJobs.map((job: any) => ({
            id: job.job_id || job.id,
            company: job.Companies?.name || job.Company?.name || job.company?.name || "Unknown Company",
            logo: job.Companies?.profile_picture || job.Company?.profile_picture || job.company?.profile_picture,
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
            location: job.location || "Remote",
            salary: job.salary || job.expected_salary || null,
            periodSalary: job.periodSalary || "month",
            currency: job.currency || "USD",
            title: job.title,
            type: job.job_type?.replace('_', ' ') || "Full Time",
            description: job.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || "",
            requirements: job.skills?.map((skill: any) => skill.name) || [],
            lat: parseFloat(job.latitude) || 0,
            lng: parseFloat(job.longitude) || 0,
            slug: job.slug,
        }));
    }, [apiJobs]);    useEffect(() => {
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

// Use API data instead of dummy data
    // Jobs will be loaded from the useJobs hook
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
        <section className="max-w-7xl mx-auto px-4 py-16">
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
                    loading={apiLoading}
                    coords={coords}
                    maxJobs={8}
                />
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:block">
                <JobGrid 
                    jobs={displayedJobs}
                    loading={apiLoading}
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
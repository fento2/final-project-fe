import React from "react";
import DiscoveryJobCard from "./DiscoveryJobCard";

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

interface JobGridProps {
    jobs: Job[];
    loading: boolean;
    coords: { lat: number; lng: number } | null;
    maxJobs?: number;
}

const JobGrid: React.FC<JobGridProps> = ({ 
    jobs, 
    loading, 
    coords, 
    maxJobs = 8 
}) => {
    if (loading) {
        return (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <p className="col-span-full text-center text-gray-500">Loading jobs…</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <p className="col-span-full text-center text-gray-500">No jobs found.</p>
            </div>
        );
    }

    return (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.slice(0, maxJobs).map((job, index) => (
                <DiscoveryJobCard 
                    key={job.id} 
                    job={job} 
                    index={index} 
                    coords={coords} 
                />
            ))}
        </div>
    );
};

export default JobGrid;

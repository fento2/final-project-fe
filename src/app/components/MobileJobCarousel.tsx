"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface MobileJobCarouselProps {
    jobs: Job[];
    loading: boolean;
    coords: { lat: number; lng: number } | null;
    maxJobs?: number;
}

const MobileJobCarousel: React.FC<MobileJobCarouselProps> = ({ 
    jobs, 
    loading, 
    coords, 
    maxJobs = 8 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Limit jobs to maxJobs with safety check
    const displayedJobs = Array.isArray(jobs) ? jobs.slice(0, maxJobs) : [];

    // Carousel navigation functions
    const nextSlide = () => {
        setCurrentIndex((prev) => 
            prev >= displayedJobs.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => 
            prev <= 0 ? displayedJobs.length - 1 : prev - 1
        );
    };

    // Reset current index when displayed jobs change
    useEffect(() => {
        setCurrentIndex(0);
    }, [displayedJobs.length]);

    // Loading state
    if (loading) {
        return (
            <div className="mt-8">
                <div className="text-center text-gray-500">Loading jobs...</div>
            </div>
        );
    }

    // Empty state
    if (displayedJobs.length === 0) {
        return (
            <div className="mt-8">
                <div className="text-center text-gray-500">No jobs found.</div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {displayedJobs.map((job, index) => (
                            <div key={job.id} className="w-full flex-shrink-0 px-2">
                                <DiscoveryJobCard 
                                    job={job} 
                                    index={index} 
                                    coords={coords} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {displayedJobs.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                            aria-label="Previous job"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                            aria-label="Next job"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {displayedJobs.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {displayedJobs.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    index === currentIndex
                                        ? 'bg-indigo-600 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileJobCarousel;

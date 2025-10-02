"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobs } from "@/hooks/useJobs";
import { X } from "lucide-react";
import { filterJobsBySearch } from "./search/SearchAlgorithm";
import { transformJobData, logSearchResults } from "./search/SearchUtils";
import SearchJobCard from "./SearchJobCard";
import NoResults from "./NoResults";
import LoadingSkeleton from "./LoadingSkeleton";

interface Job {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
    slug?: string;
    companyLogo?: string;
    createdAt?: string;
}

const SearchResultsSection = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { jobs: backendJobs, loading, error } = useJobs({ limit: 50 });
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";

    // Filter jobs based on search parameters
    useEffect(() => {
        const hasSearchParams = Boolean(query || location);
        
        if (hasSearchParams) {
            setIsVisible(true);
            
            const filtered = filterJobsBySearch(backendJobs, query, location)
                .map(transformJobData);
            
            logSearchResults(filtered, backendJobs, query, location);
            setFilteredJobs(filtered);
        } else {
            setIsVisible(false);
            setFilteredJobs([]);
        }
    }, [query, location, backendJobs]);

    const handleJobClick = (job: Job) => {
        const url = job.slug ? `/jobs/${job.slug}` : `/jobs/${job.id}`;
        router.push(url);
    };

    const clearSearch = () => {
        router.push("/");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <section id="search-results" className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            {query && (
                                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                    Query: "{query}"
                                </span>
                            )}
                            {location && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    Location: {location}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={clearSearch}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Clear Search
                    </button>
                </div>

                {/* States */}
                {loading && <LoadingSkeleton />}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Failed to load search results. Please try again.</p>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600">
                                Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {filteredJobs.length === 0 ? (
                            <NoResults query={query} location={location} />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredJobs.map((job, index) => (
                                        <SearchJobCard
                                            key={job.id}
                                            job={job}
                                            query={query}
                                            onJobClick={handleJobClick}
                                            index={index}
                                        />
                                    ))}
                                </div>

                                {/* View All Results Link */}
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => router.push(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`)}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        View All Results ({filteredJobs.length})
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default SearchResultsSection;
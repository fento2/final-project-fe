"use client";
import React, { useMemo, useState, useEffect } from "react";
import BrowseJobCard from "./BrowseJobCard";
import { Filters } from "./JobsFilterSection";
import { Pagination } from "./Pagination";
import { useFilteredJobs } from "../hooks/useFilteredJobs";
import { generateMockJobs } from "../utils/mockDataGenerator";
import { transformBackendJobs, applyJobFilters, sortJobs, paginateJobs } from "../utils/jobHelpers";

interface JobsGridSectionProps {
    filters: Filters;
}

const JobsGridSection: React.FC<JobsGridSectionProps> = ({ filters }) => {
    const [page, setPage] = useState(1);
    const { rawJobs, loading, error, refetch } = useFilteredJobs(filters);
    const perPage = 12;

    // Transform and filter jobs
    const { processedJobs, totalPages } = useMemo(() => {
        let jobsList = Array.isArray(rawJobs) && rawJobs.length > 0 ? rawJobs : generateMockJobs();
        
        // Transform backend data to consistent format
        const transformedJobs = transformBackendJobs(jobsList);
        
        // Apply client-side filtering
        const filteredJobs = applyJobFilters(transformedJobs, filters);
        
        // Apply sorting
        const sortBy = filters.sortBy || 'date';
        const sortedJobs = sortJobs(filteredJobs, sortBy);
        
        // Get pagination info
        const pagination = paginateJobs(sortedJobs, page, perPage);
        
        return {
            processedJobs: pagination.jobs,
            totalPages: pagination.totalPages,
            totalJobs: pagination.totalJobs
        };
    }, [rawJobs, filters, page, perPage]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">Error loading jobs</p>
                    <p className="text-gray-500">{error}</p>
                </div>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (processedJobs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">No jobs found</p>
                    <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Reset Filters
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                    Showing {((page - 1) * perPage) + 1}-{Math.min(page * perPage, processedJobs.length)} of {processedJobs.length} jobs
                </div>
                {totalPages > 1 && (
                    <div className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </div>
                )}
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedJobs.map((job) => (
                    <div key={job.id} className="h-full">
                        <BrowseJobCard job={job} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            )}
        </div>
    );
};

export default JobsGridSection;
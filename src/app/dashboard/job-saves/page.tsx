"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { useAuthRole } from '@/helper/useAuthRole';
import { useSavedJobs } from './hooks/useSavedJobsHook';
import { SavedJobCard } from './components/SavedJobCard';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { SavedJob } from './types/savedJobTypes';

export default function SavedJobsPage() {
    useAuthRole('USER');
    const router = useRouter();
    const { savedJobs, loading, error, unsaveJob } = useSavedJobs();

    const handleJobClick = (job: SavedJob['Job']) => {
        router.push(`/jobs/${job.slug}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <Bookmark className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                    <p className="text-gray-600 mt-1">
                        {savedJobs.length > 0 
                            ? `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}`
                            : 'Keep track of jobs you\'re interested in'
                        }
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-2xl p-6">
                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <EmptyState error={error} />
                ) : savedJobs.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {savedJobs.map((savedJob) => (
                            <SavedJobCard
                                key={savedJob.id}
                                savedJob={savedJob}
                                onJobClick={handleJobClick}
                                onUnsaveJob={unsaveJob}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
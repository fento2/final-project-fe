"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, MapPin, Banknote, Calendar, Briefcase, Trash2, ShieldX } from 'lucide-react';
import { apiCall } from '@/helper/apiCall';
import { useAuthStore } from '@/lib/zustand/authStore';
import formatCurrency from '@/lib/formatCurrency';
import { formatDateIDDateOnly } from '@/lib/formatDate';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthRole } from '@/helper/useAuthRole';

interface SavedJob {
    id: number;
    job_id: number;
    createdAt: string;
    Job: {
        job_id: number;
        title: string;
        slug: string;
        description: string;
        category: string;
        location: string;
        salary: number;
        periodSalary: string;
        currency: string;
        job_type: string;
        createdAt: string;
        expiredAt: string;
        Company: {
            name: string;
            profile_picture?: string;
        };
    };
}

export default function SavedJobsPage() {
    useAuthRole('USER')
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { role, checkLogin, isLogin } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Wait for keep-login to finish
        if (checkLogin) return;

        console.log('Auth store state:', { isLogin, role, checkLogin });

        if (!isLogin) {
            console.log('User not authenticated (store), redirecting to login');
            router.push('/login');
            return;
        }

        if (role !== 'USER') {
            console.log('Access denied: not USER role');
            setError('Access denied. This page is only available for job seekers.');
            setLoading(false);
            return;
        }

        console.log('Authenticated USER, fetching saved jobs');
        fetchSavedJobs();
    }, [isLogin, checkLogin, role, router]);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            console.log('Fetching saved jobs...');
            const { data } = await apiCall.get('/job-saves', {
                params: { page: 1, limit: 10 },
            });
            console.log('Saved jobs response:', data);

            // Normalize response from backend (data[].Jobs, Companies, job_save_id, createdAd, etc.)
            const normalize = (raw: any): SavedJob[] => {
                // Prefer array under raw.data based on your sample
                const arr = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];

                const mapped = arr
                    .filter(Boolean)
                    .map((item: any, index: number) => {
                        const jobNode = item?.Jobs ?? item?.Job ?? item?.job ?? null;
                        const compNode = jobNode?.Companies ?? jobNode?.Company ?? item?.Companies ?? null;

                        // If no job node, skip
                        if (!jobNode) return null;

                        const currency = jobNode?.currency === 'RP' ? 'IDR' : (jobNode?.currency ?? 'IDR');

                        const normalized: SavedJob = {
                            id: item?.job_save_id ?? item?.id ?? index,
                            job_id: item?.job_id ?? jobNode?.job_id ?? index,
                            createdAt: item?.createdAd ?? item?.createdAt ?? item?.created_at ?? new Date().toISOString(),
                            Job: {
                                job_id: jobNode?.job_id ?? item?.job_id ?? index,
                                title: jobNode?.title ?? '',
                                slug: jobNode?.slug ?? String(jobNode?.job_id ?? item?.job_id ?? index),
                                description: jobNode?.description ?? '',
                                category: jobNode?.category ?? '',
                                location: jobNode?.location ?? '',
                                salary: Number(jobNode?.salary ?? 0),
                                periodSalary: jobNode?.periodSalary ?? jobNode?.period_salary ?? 'month',
                                currency,
                                job_type: jobNode?.job_type ?? '',
                                createdAt: jobNode?.createdAt ?? '',
                                expiredAt: jobNode?.expiredAt ?? '',
                                Company: {
                                    name: compNode?.name ?? '',
                                    profile_picture: compNode?.profile_picture,
                                },
                            },
                        };

                        return normalized;
                    });

                return mapped.filter((j: any) => j && j.Job) as SavedJob[];
            };

            const normalized = normalize(data);
            console.log('Normalized saved jobs:', normalized);
            setSavedJobs(normalized);
        } catch (err: any) {
            console.error('Saved jobs fetch error:', err);
            const status = err?.response?.status;
            const serverMessage = err?.response?.data?.message;

            if (status === 401) {
                // Not authenticated -> go to login
                router.push('/login');
                return;
            }

            if (status === 403) {
                setError('Access denied. This page is only available for job seekers.');
                return;
            }

            if (status >= 500) {
                // Server error: show friendly message and fallback to empty list
                setError('Server error while fetching saved jobs' + (serverMessage ? `: ${serverMessage}` : ''));
                setSavedJobs([]);
                return;
            }

            // Other errors
            setError('Failed to fetch saved jobs' + (serverMessage ? `: ${serverMessage}` : err?.message ? `: ${err.message}` : ''));
        } finally {
            setLoading(false);
        }
    };

    const unsaveJob = async (jobId: number) => {
        try {
            await apiCall.delete(`/job-saves/${jobId}`);
            setSavedJobs(prev => (prev || []).filter(item => item?.Job?.job_id !== jobId));
        } catch (err: any) {
            console.error('Error removing saved job:', err);
        }
    };

    const handleJobClick = (job: SavedJob['Job']) => {
        router.push(`/jobs/${job.slug || job.job_id}`);
    };

    // Show loading while checking session
    if (checkLogin) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show access denied for non-USER roles
    if (isLogin && role !== 'USER') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center py-16">
                        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                        <p className="text-gray-600 mb-6">
                            This page is only available for job seekers.
                            {role === 'COMPANY' && ' Companies can manage their job postings from the company dashboard.'}
                            {role === 'DEVELOPER' && ' Developers have access to different dashboard features.'}
                        </p>
                        <Link
                            href="/dashboard"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow p-6">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center py-16">
                        {error.includes('Access denied') ? (
                            <>
                                <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                                <p className="text-red-600 mb-6">{error}</p>
                                <Link
                                    href="/dashboard"
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={fetchSavedJobs}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Bookmark className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                    </div>
                    <p className="text-gray-600">
                        {savedJobs.length === 0
                            ? "You haven't saved any jobs yet. Start exploring and save jobs you're interested in!"
                            : `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}`
                        }
                    </p>
                </div>

                {/* Saved Jobs List */}
                {savedJobs.length === 0 ? (
                    <div className="text-center py-16">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No saved jobs yet</h2>
                        <p className="text-gray-500 mb-6">
                            Browse our job listings and save the ones that interest you.
                        </p>
                        <Link
                            href="/jobs/browse"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {savedJobs.filter(Boolean).map((savedJob, idx) => {
                            const job = savedJob.Job;
                            return (
                                <div
                                    key={savedJob?.id ?? savedJob?.job_id ?? job?.job_id ?? idx}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6 cursor-pointer group"
                                    onClick={() => handleJobClick(job)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Company Logo */}
                                            <div className="w-16 h-16 rounded-lg bg-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {job.Company?.profile_picture ? (
                                                    <Image
                                                        src={job.Company.profile_picture}
                                                        alt={job.Company.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Briefcase className="w-8 h-8 text-indigo-600" />
                                                )}
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {job.title}
                                                </h3>

                                                <p className="text-gray-600 mb-3">{job.Company?.name}</p>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Banknote className="w-4 h-4" />
                                                        <span>{formatCurrency(job.salary, { currency: job.currency || 'IDR' })}/{job.periodSalary}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Saved {formatDateIDDateOnly(savedJob.createdAt)}</span>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        {job.job_type}
                                                    </span>
                                                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                        {job.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    unsaveJob(job.job_id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                title="Remove from saved jobs"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { Banknote, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useJobs } from "@/hooks/useJobs";

type Job = {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
};

type Filters = {
    date: string;
    types: string[];
    tools: string[];
    salaryMin: number;
    salaryMax: number;
};

function SidebarFilters({
    onChange,
    filters,
}: {
    // filters: Record<string, any>;
    // onChange: (next: Record<string, any>) => void;
    filters: Filters;
    onChange: React.Dispatch<React.SetStateAction<Filters>>;
}) {
    return (
        <aside className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold mb-2">Date Posted</h3>
                {["Last 24 hours", "Last 3 days", "Last 7 days", "Anytime"].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="date"
                            checked={filters.date === d}
                            onChange={() => onChange({ ...filters, date: d })}
                            className="form-radio"
                        />
                        {d}
                    </label>
                ))}
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Job Type</h3>
                {["Full Time", "Contract", "Internship", "Part-time"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={filters.types.includes(t)}
                            onChange={() =>
                                onChange({
                                    ...filters,
                                    types: filters.types.includes(t)
                                        ? filters.types.filter((x: string) => x !== t)
                                        : [...filters.types, t],
                                })
                            }
                            className="form-checkbox"
                        />
                        {t}
                    </label>
                ))}
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Languages / Tools</h3>
                {["React", "Figma", "Photoshop", "Canva"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={filters.tools.includes(t)}
                            onChange={() =>
                                onChange({
                                    ...filters,
                                    tools: filters.tools.includes(t)
                                        ? filters.tools.filter((x: string) => x !== t)
                                        : [...filters.tools, t],
                                })
                            }
                            className="form-checkbox"
                        />
                        {t}
                    </label>
                ))}
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Salary</h3>
                <div className="text-sm text-gray-600 mb-2">Min: ${filters.salaryMin} — Max: ${filters.salaryMax}</div>
                <input
                    type="range"
                    min={0}
                    max={200000}
                    value={filters.salaryMax}
                    onChange={(e) => onChange({ ...filters, salaryMax: Number(e.target.value) })}
                    className="w-full"
                />
            </div>
        </aside>
    );
}

function JobCard({ job }: { job: Job }) {
    const router = useRouter();
    const description = [
        "Bachelor's degree in design or related",
        "5+ years of experience in UI design",
        "Proficiency in Adobe Creative Suite",
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
            <div>
                {/* BARIS 1: Job title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{job.title}</h3>

                {/* BARIS 2: Logo + Company name */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M3 12h18" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 3v18" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg> */}
                        <Image
                            src="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="TEST"
                            width={72}
                            height={72}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <div className="text-sm text-gray-500">{job.company}</div>
                </div>

                {/* BARIS 3: Badge job type */}
                <div className="mb-4">
                    <span className="text-xs px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                        {job.type}
                    </span>
                </div>

                {/* description */}
                <ul className="mt-2 text-sm text-gray-600 space-y-2 list-disc list-inside">
                    {description.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin width={20} height={20} />
                        {/* <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="9" r="2" fill="currentColor" />
                        </svg> */}
                        <div>{job.location}</div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        {/* <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 3v18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 7h8a2 2 0 010 4H8a2 2 0 010-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg> */}
                        <Banknote width={20} height={20} />
                        <div>${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} per year</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition text-white rounded-lg font-medium" onClick={() => router.push(`/jobs/${slugify(job.title)}`)}>
                    Apply This Job
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M6 3h12v18l-6-4-6 4V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}) {
    // buat window 5 halaman dengan page aktif di tengah bila memungkinkan
    const visible = 5;
    const half = Math.floor(visible / 2);
    let start = Math.max(1, page - half);
    let end = start + visible - 1;
    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - visible + 1);
    }
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="flex items-center justify-center gap-6 mt-8">
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                aria-label="Previous page"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className="flex items-center gap-4">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition ${p === page
                            ? "bg-indigo-600 text-white rounded-lg shadow"
                            : "text-gray-700"
                            }`}
                    >
                        {p.toString().padStart(2, "0")}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                aria-label="Next page"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

function slugify(title: string) {
    // ganti slash dan karakter bermasalah lalu encode
    return encodeURIComponent(title.replace(/\//g, "-"));
}

export default function JobsListPage() {
    const { jobs, loading, error } = useJobs();

    const [filters, setFilters] = useState({
        date: "Anytime",
        types: [] as string[],
        tools: [] as string[],
        salaryMin: 0,
        salaryMax: 100000,
    });

    const [page, setPage] = useState(1);
    const perPage = 9;

    const transformedJobs = useMemo(() => {
        return jobs.map((job: any) => ({
            id: job.job_id?.toString() || job.id?.toString() || '',
            title: job.title || 'Job Position',
            company: job.Company?.name || 'Unknown Company',
            type: (job.job_type?.replace('_', ' ') || 'Full Time') as Job["type"],
            location: job.location || 'Remote',
            salaryMin: job.salary || 0,
            salaryMax: job.salary ? job.salary * 1.5 : 0,
            tags: job.skills?.map((skill: any) => skill.name) || [],
        }));
    }, [jobs]);

    const filtered = useMemo(() => {
        return transformedJobs.filter((j) => {
            if (filters.types.length && !filters.types.includes(j.type)) return false;
            if (filters.salaryMax && j.salaryMin && j.salaryMin > filters.salaryMax) return false;
            if (filters.tools.length && !filters.tools.every((t) => j.tags?.includes(t))) return false;
            return true;
        });
    }, [transformedJobs, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const shown = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-6">
                {/* Hero header similar to the provided design */}
                <div className="relative overflow-hidden rounded-xl mb-8">
                    <div className="absolute inset-0">
                        <Image src="/images/bg_hero.jpg" alt="hero" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
                        <nav className="text-sm text-indigo-600 mb-4">
                            <a href="/" className="hover:underline">Home</a>
                            <span className="mx-2 text-gray-300">/</span>
                            <a href="/jobs" className="hover:underline">Jobs</a>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-700">Browse</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">Browse Through Variety of Jobs</h1>
                        <p className="text-gray-600 max-w-2xl">Find the perfect role from startups to enterprise teams — filter by date, job type, location, tools, and salary to quickly narrow results.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow p-6">
                                <SidebarFilters filters={filters} onChange={setFilters} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Error loading jobs: {error}</p>
                            </div>
                        ) : transformedJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No jobs found</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {shown.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>

                                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
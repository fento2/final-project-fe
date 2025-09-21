"use client";

import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { WorkHistoryModal } from "./components/WorkHistoryModal";
import { apiCall } from "@/helper/apiCall";
import { toDateStartTimestamp } from "@/lib/formatDate";
import { generateCompanySlug } from "@/helper/companySlugHelper";

interface Job {
    nameJob: string;
    nameCompany: string;
    status: "Current" | "Past";
    wage: string;
    periodStart: string;
    periodEnd: string;
    companyLogo?: string | null;
}

// initial placeholder (will be replaced by backend data on load)
const jobs: Job[] = [];

const statusColors: Record<Job["status"], string> = {
    "Current": "bg-green-100 text-green-700",
    "Past": "bg-blue-100 text-blue-700",
    // Renovation: "bg-yellow-100 text-yellow-700",
    // "On Construction": "bg-gray-200 text-gray-600",
};

export default function MyJobsPage() {
    const [search, setSearch] = useState("");
    const [filterJobStatus, setFilterJobStatus] = useState("All");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // make jobs editable locally so modal can add new item
    const [jobList, setJobList] = useState<Job[]>(jobs);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // form state for modal
    const [form, setForm] = useState({
        nameJob: "",
        nameCompany: "",
        status: "Current" as Job["status"],
        wage: "",
        periodStart: "",
        periodEnd: "",
    });

    function handleChange<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((s) => ({ ...s, [key]: value }));
    }

    function handleAddJob(e?: React.FormEvent) {
        e?.preventDefault();
        const periodText =
            form.periodStart && form.periodEnd
                ? `${form.periodStart} - ${form.periodEnd}`
                : form.periodStart || form.periodEnd || "-";

        const newJob: Job = {
            nameJob: form.nameJob || "Untitled",
            nameCompany: form.nameCompany || "Unknown",
            status: form.status,
            wage: form.wage || "-",
            periodStart: form.periodStart,
            periodEnd: form.periodEnd,
        };
        setJobList((prev) => [newJob, ...prev]);
        setShowModal(false);
        // reset form (optional)
        setForm({
            nameJob: "",
            nameCompany: "",
            status: "Current",
            wage: "",
            periodStart: "",
            periodEnd: "",
        });
    }

    // helper: build absolute URL if backend returns relative path
    function toAbsolute(url?: string | null): string | null {
        if (!url || typeof url !== "string") return null;
        if (/^https?:\/\//i.test(url)) return url;
        const beBase = process.env.NEXT_PUBLIC_URL_BE || "";
        if (!beBase) return url;
        return `${beBase}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    // map experiences to UI Jobs and enrich with company logos
    async function mapExperiencesToJobsWithLogos(data: any[]): Promise<Job[]> {
        const toYmd = (d: Date | null) =>
            d && !Number.isNaN(d.getTime())
                ? `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
                : "";

        const mappedBase: Job[] = (Array.isArray(data) ? data : []).map((exp) => {
            const start = exp?.startDate ? new Date(exp.startDate) : null;
            const end = exp?.endDate ? new Date(exp.endDate) : null;
            return {
                nameJob: exp?.position || "-",
                nameCompany: exp?.name || "-",
                status: end ? "Past" : "Current",
                wage: "-",
                periodStart: toYmd(start),
                periodEnd: end ? toYmd(end) : "",
            } as Job;
        });

        // fetch logos per unique company name
        const names = Array.from(
            new Set(
                mappedBase
                    .map((m) => m.nameCompany)
                    .filter((n) => n && n !== "-")
            )
        );

        const logoByName = new Map<string, string | null>();
        await Promise.all(
            names.map(async (name) => {
                try {
                    const slug = generateCompanySlug(name);
                    if (!slug) return;
                    const res = await apiCall.get(`/company/name/${slug}`);
                    const company = res?.data?.data ?? res?.data ?? {};
                    const logo = toAbsolute(company?.profile_picture) || null;
                    logoByName.set(name, logo);
                } catch (e) {
                    // ignore failures for individual lookups
                    logoByName.set(name, null);
                }
            })
        );

        const enriched = mappedBase.map((m) => ({
            ...m,
            companyLogo: logoByName.get(m.nameCompany) ?? null,
        }));

        // sort newest start first
        enriched.sort((a, b) => new Date(b.periodStart || 0).getTime() - new Date(a.periodStart || 0).getTime());
        return enriched;
    }

    // fetch experiences from backend and map to UI shape + logos
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await apiCall.get("/experiences");
                const data: any[] = res?.data?.data ?? res?.data ?? [];
                const mapped = await mapExperiencesToJobsWithLogos(data);
                setJobList(mapped);
                // reset to first page when new data arrives
                setPage(1);
            } catch (e: any) {
                setError(e?.response?.data?.message || e?.message || "Failed to load work history");
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const filteredJobs = jobList.filter(
        (job) => {
            const matchesSearch = job.nameJob.toLowerCase().includes(search.toLowerCase()) ||
                job.nameCompany.toLowerCase().includes(search.toLowerCase())
            const matchesStatus = filterJobStatus.toLowerCase() === "all" ||
                job.status.toLowerCase() === filterJobStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        }
    );

    // pagination derived values
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagedJobs = filteredJobs.slice(startIdx, endIdx);
    const resultsStart = filteredJobs.length === 0 ? 0 : startIdx + 1;
    const resultsEnd = Math.min(endIdx, filteredJobs.length);

    return (
        <div className="p-6 md:pl-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">My Jobs</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex gap-2"
                >
                    <Plus /> Add new job
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <select className="border rounded-lg px-3 py-2" value={filterJobStatus} onChange={(e) => setFilterJobStatus(e.target.value)}>
                    <option value="All">All jobs</option>
                    <option value="Current">Current</option>
                    <option value="Past">Past</option>
                </select>

                <input
                    type="text"
                    placeholder="Search job or company"
                    className="border rounded-lg px-3 py-2 w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Job</th>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Wages</th>
                            <th className="px-6 py-3">Period</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedJobs.map((job) => (
                            <tr key={job.nameCompany} className="border-t">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <Image
                                        src={job.companyLogo || "/images/logo.png"}
                                        alt={job.nameJob}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <span>{job.nameJob}</span>
                                </td>
                                <td className="px-6 py-4">{job.nameCompany}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[job.status]}`}
                                    >
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{job.wage}</td>
                                <td className="px-6 py-4">{job.periodStart} - {job.periodEnd === "" ? "now" : job.periodEnd}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <button className={`border px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer`}>Review</button>
                                    </div>
                                </td>
                                {/* <td className="px-6 py-4">
                                    <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
                                </td> */}
                            </tr>
                        ))}
                        {pagedJobs.length === 0 && (
                            <tr>
                                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                                    {loading ? "Loading..." : error ? error : "No work history found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                    Results: {resultsStart} - {resultsEnd} of {filteredJobs.length}
                </span>
                <div className="flex gap-2">
                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            <WorkHistoryModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={async (job) => {
                    try {
                        // map modal fields to backend payload
                        await apiCall.post("/experiences", {
                            name: job.nameCompany,
                            position: job.nameJob,
                            startDate: toDateStartTimestamp(job.periodStart),
                            endDate: job.periodEnd ? toDateStartTimestamp(job.periodEnd) : null,
                            description: null,
                        });
                        // refresh list
                        const res = await apiCall.get("/experiences");
                        const data: any[] = res?.data?.data ?? res?.data ?? [];
                        const mapped = await mapExperiencesToJobsWithLogos(data);
                        setJobList(mapped);
                        setPage(1);
                    } catch (e) {
                        // swallow error for now; could add toast
                    }
                }}
            />
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
        <div className="flex items-center justify-center gap-6 mt-2">
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                aria-label="Previous page"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className="flex items-center gap-2">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition ${p === page
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

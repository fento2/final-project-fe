"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { Pagination } from "@/app/jobs/page";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface Job {
    nameJob: string;
    nameCompany: string;
    status: "Current" | "Past";
    wage: string;
    periodStart: string;
    periodEnd: string;
}

const jobs: Job[] = [
    {
        nameJob: "Peaceful Retreat Space",
        nameCompany: "PT. Maju Mundur",
        status: "Current",
        wage: "$610,000",
        periodStart: "2025/07/01",
        periodEnd: "now",
    },
    {
        nameJob: "Happy Lagoon Farm",
        nameCompany: "PT. Mundur Maju",
        status: "Past",
        wage: "$880,000",
        periodStart: "2025/01/01",
        periodEnd: "2025/06/30",
    },
    {
        nameJob: "Green Hangout Place",
        nameCompany: "PT. Gak Mundur Mundur",
        status: "Past",
        wage: "$650,000",
        periodStart: "2024/01/01",
        periodEnd: "2024/12/31",
    },
    // tambahkan data lain sesuai kebutuhan
];

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
    const totalPages = 5

    // make jobs editable locally so modal can add new item
    const [jobList, setJobList] = useState<Job[]>(jobs);
    const [showModal, setShowModal] = useState(false);

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

    const filteredJobs = jobList.filter(
        (job) => {
            const matchesSearch = job.nameJob.toLowerCase().includes(search.toLowerCase()) ||
                job.nameCompany.toLowerCase().includes(search.toLowerCase())
            const matchesStatus = filterJobStatus.toLowerCase() === "all" ||
                job.status.toLowerCase() === filterJobStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        }
    );

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
                    placeholder="Search ID, location"
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
                        {filteredJobs.map((job) => (
                            <tr key={job.nameCompany} className="border-t">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <Image
                                        // src={job.image}
                                        src="https://images.unsplash.com/photo-1612810806563-4cb8265db55f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                    Results: 1 - {filteredJobs.length} of {jobList.length}
                </span>
                <div className="flex gap-2">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <form
                        onSubmit={handleAddJob}
                        className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">Add new job</h2>
                            <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <Label className="mb-1">Job Name</Label>
                            <input
                                value={form.nameJob}
                                onChange={(e) => handleChange("nameJob", e.target.value)}
                                placeholder="Job name"
                                className="w-full border rounded px-3 py-2"
                            />
                            <Label className="mb-1">Company Name</Label>
                            <input
                                value={form.nameCompany}
                                onChange={(e) => handleChange("nameCompany", e.target.value)}
                                placeholder="Company"
                                className="w-full border rounded px-3 py-2"
                            />
                            <Label className="mb-1">Status</Label>
                            <select
                                value={form.status}
                                onChange={(e) => handleChange("status", e.target.value as Job["status"])}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Current">Current</option>
                                <option value="Past">Past</option>
                            </select>
                            <Label className="mb-1">Wage</Label>
                            <input
                                type="number"
                                inputMode="decimal"
                                pattern="[0-9]"
                                value={form.wage}
                                onChange={(e) => handleChange("wage", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key.length === 1 && !/[0-9.]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                placeholder="Wages"
                                className="w-full border rounded px-3 py-2"
                            />
                            <Label className="mb-1">Start Work</Label>
                            <input
                                type="date"
                                value={form.periodStart}
                                onChange={(e) => handleChange("periodStart", e.target.value)}
                                placeholder="Period Work Start"
                                className="w-full border rounded px-3 py-2"
                            />
                            <Label className="mb-1">End Work</Label>
                            <input
                                type="date"
                                value={form.periodEnd}
                                onChange={(e) => handleChange("periodEnd", e.target.value)}
                                placeholder="Period Work End"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Add job</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

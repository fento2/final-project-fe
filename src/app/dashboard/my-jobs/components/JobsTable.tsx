import Image from "next/image";
import { Job, statusColors } from "../types/job.types";

interface JobsTableProps {
    jobs: Job[];
    loading: boolean;
    error: string;
}

export function JobsTable({ jobs, loading, error }: JobsTableProps) {
    return (
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
                    {jobs.map((job, index) => (
                        <tr key={`${job.nameCompany}-${index}`} className="border-t">
                            <td className="px-6 py-4 flex items-center gap-3">
                                {job.companyLogo ? (
                                    <Image
                                        src={job.companyLogo}
                                        alt={job.nameJob}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {job.nameCompany.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
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
                                    <button className="border px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                        Review
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {jobs.length === 0 && (
                        <tr>
                            <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                                {loading ? "Loading..." : error ? error : "No work history found"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
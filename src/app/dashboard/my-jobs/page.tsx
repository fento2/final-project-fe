"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { WorkHistoryModal } from "./components/WorkHistoryModal";
import { JobsTable } from "./components/JobsTable";
import { JobFilters } from "./components/JobFilters";
import { Pagination as PaginationComponent } from "./components/Pagination";
import { useAuthRole } from "@/helper/useAuthRole";
import { useMyJobs } from "./hooks/useMyJobs";
import { useJobFilters } from "./hooks/useJobFilters";

export default function MyJobsPage() {
    useAuthRole('USER');
    const [search, setSearch] = useState("");
    const [filterJobStatus, setFilterJobStatus] = useState("All");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const pageSize = 10;

    const { jobList, loading, error, addJob } = useMyJobs();
    
    const { 
        pagedJobs, 
        totalPages, 
        currentPage, 
        resultsStart, 
        resultsEnd, 
        totalResults 
    } = useJobFilters({
        jobList,
        search,
        filterJobStatus,
        page,
        pageSize,
    });

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

            <JobFilters
                search={search}
                setSearch={setSearch}
                filterJobStatus={filterJobStatus}
                setFilterJobStatus={setFilterJobStatus}
            />

            <JobsTable
                jobs={pagedJobs}
                loading={loading}
                error={error}
            />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                    Results: {resultsStart} - {resultsEnd} of {totalResults}
                </span>
                <div className="flex gap-2">
                    <PaginationComponent page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            <WorkHistoryModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={async (job) => {
                    try {
                        await addJob(job);
                        setPage(1);
                    } catch (e) {
                        // swallow error for now; could add toast
                    }
                }}
            />
        </div>
    );
}

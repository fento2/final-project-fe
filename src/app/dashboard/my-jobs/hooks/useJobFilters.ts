import { useMemo } from "react";
import { Job } from "../types/job.types";

interface UseJobFiltersProps {
    jobList: Job[];
    search: string;
    filterJobStatus: string;
    page: number;
    pageSize: number;
}

export function useJobFilters({ jobList, search, filterJobStatus, page, pageSize }: UseJobFiltersProps) {
    const filteredJobs = useMemo(() => {
        return jobList.filter((job) => {
            const matchesSearch = 
                job.nameJob.toLowerCase().includes(search.toLowerCase()) ||
                job.nameCompany.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = 
                filterJobStatus.toLowerCase() === "all" ||
                job.status.toLowerCase() === filterJobStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [jobList, search, filterJobStatus]);

    const paginationData = useMemo(() => {
        const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
        const currentPage = Math.min(page, totalPages);
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const pagedJobs = filteredJobs.slice(startIdx, endIdx);
        const resultsStart = filteredJobs.length === 0 ? 0 : startIdx + 1;
        const resultsEnd = Math.min(endIdx, filteredJobs.length);

        return {
            pagedJobs,
            totalPages,
            currentPage,
            resultsStart,
            resultsEnd,
            totalResults: filteredJobs.length,
        };
    }, [filteredJobs, page, pageSize]);

    return {
        filteredJobs,
        ...paginationData,
    };
}
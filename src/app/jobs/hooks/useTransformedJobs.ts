import { useMemo } from "react";
import { Job } from "../types/jobsPageTypes";

export const useTransformedJobs = (backendJobs: any[]) => {
    return useMemo(() => {
        return backendJobs.map((job: any): Job => ({
            id: job.job_id?.toString() || job.id?.toString(),
            title: job.title,
            company: job.Companies?.name || job.company?.name || 'Unknown Company',
            companyLogo: job.Companies?.profile_picture || job.company?.profile_picture,
            companyData: job.Companies || job.company,
            type: job.job_type || job.type || 'Full Time',
            location: job.location,
            salaryMin: job.salary,
            salaryMax: job.salaryMax,
            tags: job.tags || [],
            slug: job.slug,
            createdAt: job.createdAt || job.created_at,
        }));
    }, [backendJobs]);
};
import { Job as BackendJob } from "@/types/database";
import { Filters } from "../components/JobsFilterSection";

interface Job {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract" | "Freelance" | "Temporary" | "Remote" | "Hybrid";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryDisplay?: string;
    category?: string;
    description?: string | string[];
    tags?: string[];
    slug?: string;
    companyLogo?: string | null;
    createdAt?: string;
    expiredAt?: string;
}

// Transform backend data to match our Job interface
export const transformBackendJobs = (jobsList: BackendJob[]): Job[] => {
    return jobsList.map((job: BackendJob) => ({
        id: job.job_id?.toString() || String(job.job_id) || 'unknown',
        title: job.title || 'Untitled Job',
        company: job.Companies?.name || job.Company?.name || 'Unknown Company',
        type: (job.job_type as Job["type"]) || "Full Time",
        location: job.location || 'Remote',
        salaryMin: job.salary,
        salaryMax: job.salary,
        salaryDisplay: job.salary ? `IDR ${job.salary.toLocaleString('id-ID')} per ${job.periodSalary || 'month'}` : undefined,
        category: job.category,
        description: job.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || "",
        tags: [], // Will be populated if skills data is available
        slug: job.slug,
        companyLogo: job.Companies?.profile_picture || job.Company?.profile_picture || "/images/logo.png",
        createdAt: job.createdAt,
        expiredAt: job.expiredAt,
    }));
};

// Apply client-side filtering
export const applyJobFilters = (jobs: Job[], filters: Filters): Job[] => {
    return jobs.filter(job => {
        // Filter by title (search)
        if (filters.title && filters.title.trim()) {
            const searchTerm = filters.title.toLowerCase().trim();
            const jobTitle = job.title.toLowerCase();
            const companyName = job.company.toLowerCase();
            if (!jobTitle.includes(searchTerm) && !companyName.includes(searchTerm)) {
                return false;
            }
        }

        // Filter by categories (client-side for multi-select)
        if (filters.categories.length > 0) {
            const jobCategory = job.category || '';
            const matches = filters.categories.some(cat => 
                jobCategory.toLowerCase().includes(cat.toLowerCase())
            );
            if (!matches) return false;
        }

        // Filter by locations (client-side for multi-select)
        if (filters.location.length > 0) {
            const jobLocation = job.location || '';
            const matches = filters.location.some(loc => 
                jobLocation.toLowerCase().includes(loc.toLowerCase())
            );
            if (!matches) return false;
        }

        // Filter by job types (client-side for multi-select)
        if (filters.types.length > 0) {
            const matches = filters.types.includes(job.type);
            if (!matches) return false;
        }

        // Filter by salary range
        if (job.salaryMin !== undefined) {
            if (job.salaryMin < filters.salaryMin || job.salaryMin > filters.salaryMax) {
                return false;
            }
        }

        return true;
    });
};

// Sort jobs by various criteria
export const sortJobs = (jobs: Job[], sortBy: string): Job[] => {
    const sorted = [...jobs];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });
        case 'oldest':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateA - dateB;
            });
        case 'salary-high':
            return sorted.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        case 'salary-low':
            return sorted.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'company':
            return sorted.sort((a, b) => a.company.localeCompare(b.company));
        default:
            return sorted;
    }
};

// Paginate jobs
export const paginateJobs = (jobs: Job[], page: number, perPage: number) => {
    const totalPages = Math.ceil(jobs.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    
    return {
        jobs: paginatedJobs,
        totalPages,
        totalJobs: jobs.length,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};
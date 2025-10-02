import { useMemo } from "react";
import { Company } from "../types/jobsPageTypes";

export const useFeaturedCompanies = (backendJobs: any[]) => {
    return useMemo(() => {
        const companiesMap = new Map();
        
        backendJobs.forEach((job: any) => {
            const company = job.Companies || job.company;
            if (company && company.company_id && !companiesMap.has(company.company_id)) {
                companiesMap.set(company.company_id, {
                    company_id: company.company_id,
                    name: company.name,
                    profile_picture: company.profile_picture,
                    website: company.website,
                    location: company.location || 'Multiple Locations',
                    description: company.description,
                    email: company.email,
                    phone: company.phone,
                    // Count jobs for this company
                    jobCount: backendJobs.filter((j: any) => 
                        (j.Companies?.company_id || j.company?.company_id) === company.company_id
                    ).length
                });
            }
        });

        return Array.from(companiesMap.values()) as Company[];
    }, [backendJobs]);
};
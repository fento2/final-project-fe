export type Job = {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    companyData?: any;
    type: "Full Time" | "Part-time" | "Internship" | "Contract";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
    slug?: string;
    createdAt?: string;
};

export interface Company {
    company_id: string;
    name: string;
    profile_picture?: string;
    website?: string;
    location?: string;
    description?: string;
    email?: string;
    phone?: string;
    jobCount: number;
}
export interface SavedJob {
    id: number;
    job_id: number;
    createdAt: string;
    Job: {
        job_id: number;
        title: string;
        slug: string;
        description: string;
        category: string;
        location: string;
        salary: number;
        periodSalary: string;
        currency: string;
        job_type: string;
        createdAt: string;
        expiredAt: string;
        Company: {
            name: string;
            profile_picture?: string;
        };
    };
}
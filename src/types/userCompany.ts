export type Company = {
    company_id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    description?: string | null;
    website?: string | null;
    profile_picture?: string | null;
    user_id?: number;
};

export type Review = {
    review_id: number;
    user_company_id: number;
    salary_estimate: number;
    rating_culture: number;
    rating_work_life_balance: number;
    rating_facilities: number;
    rating_career: number;
    createAt?: string;
    updatedAt?: string;
};

export type UserCompanyItem = {
    user_company_id: number;
    company_id: number;
    user_id: number;
    start_date: string;
    end_date?: string | null;
    createAt?: string;
    updatedAt?: string;
    company: Company;
    reviews?: Review | null;
};
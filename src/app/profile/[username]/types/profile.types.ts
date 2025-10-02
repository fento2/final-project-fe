export type Profile = {
    name?: string | null;
    username?: string | null;
    email?: string | null;
    phone?: string | null;
    gender?: string | null;
    birthDate?: string | null;
    address?: string | null;
    profile_picture?: string | null;
    role?: string | null;
    createdAt?: string | null;
};

export type Education = {
    education_id: string;
    university?: string;
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    field_of_study?: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};

export type Experience = {
    experience_id?: number;
    name?: string; // company name (legacy field)
    company?: string; // primary company field from API
    position: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};
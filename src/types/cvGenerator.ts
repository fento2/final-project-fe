export interface Experience {
    experience_id: number;
    name: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description?: string | null;
    user_id: number;
}

export interface Profiles {
    profile_id: number;
    email: string;
    name: string;
    phone?: string | null;
    birthDate?: string | null;
    gender?: string | null;
    address?: string | null;
    profile_picture?: string | null;
    user_id: number;
}

export interface UserAssessment {
    user_assessment_id: number;
    assessment_id: number;
    user_id: number;
    score: number;
    date_taken: string;
    createAt: string;
    updatedAt: string;
    assessment_certificates?: {
        assessment_certificate_id: number;
        user_assessment_id: number;
        certificate_code: string;
        createAt: string;
        updatedAt: string;
    } | null;
}

export interface BackendUser {
    user_id: number;
    username: string;
    email: string;
    googleId?: string | null;
    password?: string;
    name?: string | null;
    role: "USER" | "ADMIN";
    isVerfied: boolean;
    createdAt: string;
    updatedAt: string;
    profiles?: Profiles | null;
    education?: any[];
    experience?: Experience[];
    userSkills?: { skill_name: string; level?: string }[];
    user_assessment?: UserAssessment[];
}

export type CVData = {
    headline: string;
    summary: string;
    template: string;
};
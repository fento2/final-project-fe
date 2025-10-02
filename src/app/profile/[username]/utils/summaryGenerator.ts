"use client";

type Profile = {
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

type Education = {
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

type Experience = {
    experience_id?: number;
    name?: string;
    company?: string;
    position: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};

interface SummaryGeneratorProps {
    profile: Profile;
    education: Education[];
    experiences: Experience[];
    userAssessments: any[];
    yearsExperience: number | null;
}

export function generateSummary({ 
    profile, 
    education, 
    experiences, 
    userAssessments, 
    yearsExperience 
}: SummaryGeneratorProps): string {
    const displayName = profile?.name || profile?.username || "User";
    
    if (displayName === "User") {
        return "Add a short summary about yourself to highlight your experience and goals.";
    }

    let summary = `Hi, I'm ${displayName}.`;

    // Add education info
    if (education.length > 0) {
        const latestEducation = education[0];
        const degree = latestEducation.degree || "";
        const field = latestEducation.field_of_study || latestEducation.fieldOfStudy || "";
        const institution = latestEducation.institution || latestEducation.university || "";

        if (degree && field) {
            summary += ` I hold a ${degree} degree in ${field}`;
            if (institution) {
                summary += ` from ${institution}`;
            }
            summary += ".";
        } else if (institution) {
            summary += ` I studied at ${institution}.`;
        }
    }

    // Add experience info
    if (experiences.length > 0) {
        const latestExp = experiences[0];
        const position = latestExp.position || "";
        const company = latestExp.company || latestExp.name || "";

        if (position && company) {
            summary += ` I currently work as a ${position} at ${company}.`;
        } else if (position) {
            summary += ` I work as a ${position}.`;
        }

        if (yearsExperience && yearsExperience > 0) {
            summary += ` I have ${yearsExperience}+ years of professional experience.`;
        }
    }

    // Add skills/assessment info
    if (userAssessments.length > 0) {
        const skillNames = userAssessments.map(a => a.skill_name).filter(Boolean);
        if (skillNames.length > 0) {
            const skillList = skillNames.length > 3
                ? `${skillNames.slice(0, 3).join(", ")} and ${skillNames.length - 3} more skills`
                : skillNames.join(", ");
            summary += ` I have demonstrated expertise in ${skillList}.`;
        }
    }

    // Add general closing
    summary += " I am passionate about technology and always eager to take on new challenges.";

    return summary;
}
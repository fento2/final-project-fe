import { useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { UserCompanyItem } from "@/types/userCompany";
import { Profile, Education, Experience } from "../types/profile.types";

export function usePublicProfile(username: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [education, setEducation] = useState<Education[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [dataUserCompany, setDataUserCompany] = useState<UserCompanyItem[]>([]);
    const [userAssessments, setUserAssessments] = useState<any[]>([]);

    useEffect(() => {
        if (!username) return;

        let mounted = true;
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch public profile by username
                const res = await apiCall.get(`/public/profile/${encodeURIComponent(username)}`);
                const data = res?.data?.data ?? res?.data ?? null;

                const resUserCompany = await apiCall.get("/user-companies");
                setDataUserCompany(resUserCompany.data.data);

                if (!data) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                // Hide profile if role is developer
                if (data.role?.toString?.()?.toUpperCase?.() === 'DEVELOPER') {
                    setError("Profile not available");
                    setLoading(false);
                    return;
                }

                if (!mounted) return;

                // Map profile core fields with proper null/undefined handling
                const profileData: Profile = {
                    name: data.name || null,
                    username: data.username || username, // fallback to URL param
                    email: data.email || null,
                    phone: data.phone || null, // Note: phone not included in public response
                    gender: data.gender || null,
                    birthDate: data.birthDate || null,
                    profile_picture: data.profile_picture || null,
                    address: data.address || null,
                    role: data.role || data.account_role || data.userRole || null,
                    createdAt: data.createdAt || data.created_at || null,
                };

                setProfile(profileData);

                // Map education array based on new API structure
                const eduArr: Education[] = Array.isArray(data.education)
                    ? data.education.map((e: any) => ({
                        education_id: e.education_id?.toString() || e.id?.toString() || '',
                        university: e.institution || e.university || '',
                        institution: e.institution || '',
                        degree: e.degree || '',
                        fieldOfStudy: e.field_of_study || e.fieldOfStudy || '',
                        field_of_study: e.field_of_study || '',
                        startDate: e.start_date || e.startDate || '',
                        start_date: e.start_date || '',
                        endDate: e.end_date || e.endDate || null,
                        end_date: e.end_date || null,
                        description: e.description || '',
                    }))
                    : [];
                setEducation(eduArr);

                // Map experience array based on new API structure
                const expArr: Experience[] = Array.isArray(data.experience)
                    ? data.experience.map((x: any) => ({
                        experience_id: x.experience_id || x.id || undefined,
                        name: x.company || x.name || '', // company is primary field
                        company: x.company || '',
                        position: x.position || '',
                        startDate: x.start_date || x.startDate || '',
                        start_date: x.start_date || '',
                        endDate: x.end_date || x.endDate || null,
                        end_date: x.end_date || null,
                        description: x.description || '',
                    }))
                    : [];
                setExperiences(expArr);

                // Map user assessment array
                const assessmentArr = Array.isArray(data.user_assessment)
                    ? data.user_assessment.map((assessment: any) => ({
                        user_assessment_id: assessment.user_assessment_id || assessment.id,
                        skill_name: assessment.skill_name || '',
                        score: assessment.score || 0,
                        date_taken: assessment.date_taken || '',
                        certificate_code: assessment.certificate_code || null,
                    }))
                    : [];
                setUserAssessments(assessmentArr);

                // Skills: try to map from various possible shapes in public endpoint
                try {
                    const rawSkills = Array.isArray(data?.skills)
                        ? data.skills
                        : Array.isArray(data?.user_skill)
                            ? data.user_skill
                            : Array.isArray(data?.userSkills)
                                ? data.userSkills
                                : [];

                    const names: string[] = rawSkills
                        .map((s: any) => s?.name || s?.skill?.name || s?.Skill?.name || s)
                        .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
                    setSkills(names);
                } catch {
                    setSkills([]);
                }

            } catch (err: any) {
                if (!mounted) return;
                const msg = err?.response?.data?.message || err?.message || "Failed to load profile";
                setError(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAll();
        return () => {
            mounted = false;
        };
    }, [username]);

    return {
        loading,
        error,
        profile,
        education,
        experiences,
        skills,
        dataUserCompany,
        userAssessments,
    };
}
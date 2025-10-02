"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";

// Components
import ProfileHeader from "./components/ProfileHeader";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import AssessmentSection from "./components/AssessmentSection";
import ProfileSidebar from "./components/ProfileSidebar";
import CTASection from "./components/CTASection";

// Hooks
import { usePublicProfile } from "./hooks/usePublicProfile";
import { useProfileMetrics } from "./hooks/useProfileMetrics";
import { useProfileActions } from "./hooks/useProfileActions";

// Utils
import { generateSummary } from "./utils/summaryGenerator";

export default function PublicUserProfilePage() {
    const params = useParams<{ username: string | string[] }>();
    const router = useRouter();
    const username = Array.isArray(params?.username) ? params.username[0] : params?.username;
    const { user } = useAuth();
    const { setShowSignUp } = useAuthUIStore();

    // Custom hooks
    const {
        loading,
        error,
        profile,
        education,
        experiences,
        skills,
        dataUserCompany,
        userAssessments,
    } = usePublicProfile(username || '');

    const { yearsExperience, perfectAssessments } = useProfileMetrics(experiences, userAssessments);
    const { toAbsolute, handleContactOrViewProfile } = useProfileActions();

    const handleCTAClick = () => {
        if (!user) {
            setShowSignUp(true);
        } else {
            const { role } = useAuthStore.getState();
            router.push(role === "DEVELOPER" ? "/dashboard/list-skill-assessment" : role === "COMPANY" ? "/dashboard/company" : "/dashboard/profile");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">
                        {error === "Profile not available" ? "Profile Not Available" : "User Not Found"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {error === "Profile not available"
                            ? "This profile is not available for public viewing."
                            : error || "We couldn't find the user you searched for."
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            <ProfileHeader 
                profile={profile} 
                toAbsolute={toAbsolute} 
                onContactClick={() => handleContactOrViewProfile(profile)} 
            />

            {/* Main content */}
            <div className="container max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Summary</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {generateSummary({ 
                                profile, 
                                education, 
                                experiences, 
                                userAssessments, 
                                yearsExperience 
                            })}
                        </p>
                    </section>

                    <EducationSection education={education} />
                    <ExperienceSection experiences={experiences} dataUserCompany={dataUserCompany} />
                    <AssessmentSection perfectAssessments={perfectAssessments} />
                </div>

                <ProfileSidebar 
                    profile={profile} 
                    yearsExperience={yearsExperience} 
                    skills={skills} 
                />
            </div>

            <CTASection user={user} onCTAClick={handleCTAClick} />
        </div>
    );
}

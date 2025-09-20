"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiCall } from "@/helper/apiCall";
import { useToast } from "@/components/basic-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Briefcase, GraduationCap, Award } from "lucide-react";
import formatCurrency from "@/lib/formatCurrency";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { isCompanyUser, buildCompanySlug } from "@/helper/companySlugHelper";

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
    name?: string; // company name (legacy field)
    company?: string; // primary company field from API
    position: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};

export default function PublicUserProfilePage() {
    const params = useParams<{ username: string | string[] }>();
    const router = useRouter();
    const username = Array.isArray(params?.username) ? params.username[0] : params?.username;
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [education, setEducation] = useState<Education[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [expectedSalary, setExpectedSalary] = useState<number | null>(null);
    const [userAssessments, setUserAssessments] = useState<any[]>([]);

    // Build absolute url for images
    const toAbsolute = (url?: string | null) => {
        if (!url || url === null) return "/images/logo.png";
        if (/^https?:\/\//i.test(url)) return url;
        const beBase = process.env.NEXT_PUBLIC_URL_BE || "";
        return beBase ? `${beBase}${url.startsWith("/") ? "" : "/"}${url}` : url;
    };

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
                
                console.log('API Response for profile:', res?.data);
                console.log('Profile data extracted:', data);
                console.log('All data fields:', Object.keys(data || {}));
                console.log('Role from API:', data?.role);
                console.log('Role type:', typeof data?.role);
                console.log('Full API response data:', data);
                console.log('Response data structure:', {
                    hasUser: !!data,
                    hasEducation: !!data?.education,
                    educationType: typeof data?.education,
                    educationLength: Array.isArray(data?.education) ? data.education.length : 'not array',
                    hasExperience: !!data?.experience,  
                    experienceType: typeof data?.experience,
                    experienceLength: Array.isArray(data?.experience) ? data.experience.length : 'not array',
                    hasUserAssessment: !!data?.user_assessment,
                    userAssessmentType: typeof data?.user_assessment,
                    userAssessmentLength: Array.isArray(data?.user_assessment) ? data.user_assessment.length : 'not array',
                    sampleEducation: data?.education?.[0],
                    sampleExperience: data?.experience?.[0],
                    sampleUserAssessment: data?.user_assessment?.[0]
                });
                console.log('Raw data values:', {
                    name: data?.name,
                    username: data?.username,
                    email: data?.email,
                    phone: data?.phone,
                    role: data?.role,
                    address: data?.address,
                    profile_picture: data?.profile_picture,
                    createdAt: data?.createdAt,
                    created_at: data?.created_at
                });
                
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
                
                console.log('Mapped profile data:', profileData);
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
                console.log('Mapped education data:', eduArr);
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
                console.log('Mapped experience data:', expArr);
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
                console.log('Mapped assessment data:', assessmentArr);
                setUserAssessments(assessmentArr);

                // Skills and expected salary might not be available in public endpoint
                setSkills([]);
                setExpectedSalary(null);

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

    // Handle contact/view profile action
    const handleContactOrViewProfile = () => {
        if (!profile) return;
        
        console.log('🔍 Profile data for routing:', profile);
        console.log('🔍 Display name:', displayName);
        console.log('🔍 Role value:', profile.role);
        console.log('🔍 Role type:', typeof profile.role);
        console.log('🔍 Is company user:', isCompanyUser(profile));
        
        // Check if user is a company
        if (isCompanyUser(profile)) {
            // Route to company detail page
            const companySlug = buildCompanySlug(profile);
            console.log('🏗️ Generated company slug:', companySlug);
            const companyUrl = `/jobs/companies/${companySlug}`;
            console.log('🚀 Navigating to:', companyUrl);
            router.push(companyUrl);
        } else {
            // For regular users, open email client to contact them
            if (profile.email) {
                const subject = encodeURIComponent(`Job Opportunity - Contact from Job Portal`);
                const body = encodeURIComponent(`Hello ${displayName},\n\nI found your profile on our job portal and would like to discuss a potential opportunity with you.\n\nBest regards`);
                const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${body}`;
                
                console.log('📞 Opening email client for:', profile.email);
                window.open(mailtoUrl, '_self');
            } else {
                toast.error(
                    "Email not available",
                    "This user hasn't provided a public email address."
                );
                console.log('📞 No email available for user');
            }
        }
    };

    const yearsExperience = useMemo(() => {
        try {
            const valid = experiences.filter((e) => e.startDate);
            if (valid.length === 0) return null;
            const starts = valid.map((e) => new Date(e.startDate as string).getTime());
            const ends = valid.map((e) => new Date(e.endDate || Date.now()).getTime());
            const minStart = Math.min(...starts);
            const maxEnd = Math.max(...ends);
            const diffYears = (maxEnd - minStart) / (1000 * 60 * 60 * 24 * 365.25);
            return Math.max(0, Math.round(diffYears));
        } catch {
            return null;
        }
    }, [experiences]);

    const location = profile?.address || "";
    const displayName = profile?.name || profile?.username || "User";

    // Generate dynamic summary based on available data
    const generateSummary = () => {
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
        <div className="min-h-screen w-full ">
            {/* Hero */}
            <div className="relative h-56 md:h-64 w-full -z-10">
                <Image
                    src="/images/header_bg.png"
                    alt="Profile cover"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10" />
            </div>

            {/* Header section */}
            <div className="container max-w-5xl mx-auto px-4 -mt-12 md:-mt-16">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="relative w-24 h-24 md:w-28 md:h-28 -mt-16 md:-mt-20">
                            <Image
                                src={toAbsolute(profile?.profile_picture)}
                                alt={profile?.name || "User"}
                                fill
                                className="rounded-full ring-4 ring-white object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {displayName}
                            </h1>
                            {location && (
                                <div className="mt-1 flex items-center gap-2 text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{location}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 md:self-center">
                            <Button 
                                onClick={handleContactOrViewProfile}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isCompanyUser(profile) ? 'View Full Profile' : 'Contact This Candidate'}
                            </Button>
                            {/* Quick actions */}
                            <Button variant="outline" size="icon" aria-label="Save profile">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6.32 2.577a49.255 49.255 0 0111.36 0c.585.074 1.07.49 1.188 1.063a49.527 49.527 0 010 16.72 1.5 1.5 0 01-1.188 1.064 49.255 49.255 0 01-11.36 0 1.5 1.5 0 01-1.188-1.063 49.527 49.527 0 010-16.72 1.5 1.5 0 011.188-1.064z" /></svg>
                            </Button>
                            <Button variant="outline" size="icon" aria-label="Share profile">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186a2.25 2.25 0 010 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-12.814a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0 15.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Summary</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {generateSummary()}
                        </p>
                    </section>

                    {/* Education */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600"><GraduationCap className="w-5 h-5" /> Education</h2>
                        <div className="space-y-4">
                            {education.length === 0 && (
                                <div className="text-sm text-gray-500">No education records yet.</div>
                            )}
                            {education.map((edu) => (
                                <div key={edu.education_id} className="flex gap-3">
                                    <div className="mt-1">
                                        <Image src="/images/logo.png" width={28} height={28} alt="edu" className="rounded-full" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{edu.institution || edu.university || "Institution"}</div>
                                        <div className="text-sm text-gray-600">{edu.field_of_study || edu.fieldOfStudy || "Field of Study"} {edu.degree && `• ${edu.degree}`}</div>
                                        <div className="text-xs text-gray-500">
                                            {edu.start_date || edu.startDate ? formatDateIDDateOnly(edu.start_date || edu.startDate!) : "Unknown"} - {(edu.end_date || edu.endDate) ? formatDateIDDateOnly(edu.end_date || edu.endDate!) : "Present"}
                                        </div>
                                        {edu.description && (
                                            <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Work Experience */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600"><Briefcase className="w-5 h-5" /> Work Experience</h2>
                        <div className="space-y-4">
                            {experiences.length === 0 && (
                                <div className="text-sm text-gray-500">No experience records yet.</div>
                            )}
                            {experiences.map((exp) => (
                                <Card key={exp.experience_id} className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="font-semibold text-gray-900">{exp.position}</div>
                                        <div className="text-sm text-gray-600">{exp.company || exp.name || "Company"}</div>
                                        <div className="text-xs text-gray-500">
                                            {exp.start_date || exp.startDate ? formatDateIDDateOnly(exp.start_date || exp.startDate!) : ""} - {(exp.end_date || exp.endDate) ? formatDateIDDateOnly(exp.end_date || exp.endDate!) : "Present"}
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Certifications - Skills Assessments */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
                            <Award className="w-5 h-5" /> Skill Assessments
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userAssessments.length === 0 && (
                                <div className="col-span-full text-sm text-gray-500">No skill assessments completed yet.</div>
                            )}
                            {userAssessments.map((assessment) => (
                                <Card key={assessment.user_assessment_id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <div className="mb-3">
                                                <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {assessment.skill_name}
                                                </div>
                                            </div>
                                            
                                            <div className={`text-2xl font-bold mb-2 ${
                                                assessment.score >= 80 ? 'text-green-600' : 
                                                assessment.score >= 60 ? 'text-yellow-600' : 
                                                'text-red-600'
                                            }`}>
                                                {assessment.score}%
                                            </div>
                                            
                                            {assessment.certificate_code && (
                                                <div className="mb-2">
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        Certified
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {assessment.date_taken && (
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {formatDateIDDateOnly(assessment.date_taken)}
                                                </div>
                                            )}
                                            
                                            {assessment.certificate_code && (
                                                <div className="text-xs text-gray-500 font-mono">
                                                    {assessment.certificate_code}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right column - About */}
                <aside className="space-y-6">
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Primary Industry:</span>
                                <span className="font-medium">Information Technology</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Expected Salary:</span>
                                <span className="font-medium">{expectedSalary ? formatCurrency(expectedSalary) : "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Experience:</span>
                                <span className="font-medium">{yearsExperience !== null ? `${yearsExperience}+ years` : "-"}</span>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <h4 className="text-gray-900 font-semibold">Contacts</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Phone className="w-4 h-4" />
                                <span>{profile?.phone || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Mail className="w-4 h-4" />
                                <span>{profile?.email || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <MapPin className="w-4 h-4" />
                                <span>{location || "-"}</span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h4 className="text-gray-900 font-semibold mb-2">Objective</h4>
                            <p className="text-sm text-gray-700">
                                To obtain a position in the field of software engineering that utilizes my skills and experience.
                            </p>
                        </div>

                        <div className="mt-5">
                            <h4 className="text-gray-900 font-semibold mb-3">Skills</h4>
                            {skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((s, i) => (
                                        <Badge key={`${s}-${i}`} variant="secondary" className="px-3 py-1">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No skills yet.</div>
                            )}
                        </div>
                    </section>
                </aside>
            </div>

            {/* CTA */}
            <div className="container mx-auto px-4 my-10 max-w-2xl">
                <div className="rounded-2xl bg-indigo-600 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Join Horizon Jobs today and take the next step in your career!
                        </h3>
                        <p className="text-sm text-indigo-100 mt-2">
                            With our user-friendly platform and up-to-date job listings, you'll be on your way to a fulfilling career in no time.
                        </p>
                    </div>
                    <Button variant="secondary" className="self-start md:self-auto">Join Now</Button>
                </div>
            </div>
        </div>
    );
}

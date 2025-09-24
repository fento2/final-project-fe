import { useAuthStore } from "@/lib/zustand/authStore";
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAuthRole } from "@/helper/authRole";
import { apiCall } from "@/helper/apiCall";
import { useToast } from "@/components/basic-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Briefcase, GraduationCap } from "lucide-react";
import formatCurrency from "@/lib/formatCurrency";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { useRouter } from "next/navigation";

type Profile = {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
    address?: string;
    profile_picture?: string;
    createdAt?: string;
};

type Education = {
    education_id: string;
    university: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
};

type Experience = {
    experience_id?: number;
    name: string; // company name
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
};

export default function UserProfileShowcase() {
    useAuthRole("USER");
    const toast = useToast();
    const { user } = useAuth();
    const { setShowSignUp } = useAuthUIStore();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [education, setEducation] = useState<Education[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [expectedSalary, setExpectedSalary] = useState<number | null>(null);

    const handleCTAClick = () => {
        if (!user) {
            setShowSignUp(true);
        } else {
            const { role } = useAuthStore.getState();
            router.push(role === "DEVELOPER" ? "/dashboard/list-skill-assessment" : role === "COMPANY" ? "/dashboard/company" : "/dashboard/profile");
        }
    };

    useEffect(() => {
        let mounted = true;
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [pRes, eRes, exRes, uaRes, appsRes] = await Promise.all([
                    apiCall.get("/account/get-data/user").catch(() => ({ data: {} })),
                    apiCall.get("/account/education/list").catch(() => ({ data: {} })),
                    apiCall.get("/experiences").catch(() => ({ data: {} })),
                    apiCall.get("/userAssessments").catch(() => ({ data: {} })),
                    apiCall
                        .get(`/applications/my-applications?limit=1&offset=0`)
                        .catch(() => ({ data: {} })),
                ]);

                if (!mounted) return;

                const pData: Profile | null = pRes?.data?.data ?? pRes?.data ?? null;
                setProfile(pData);

                const eduArr: Education[] = eRes?.data?.data ?? eRes?.data ?? [];
                setEducation(Array.isArray(eduArr) ? eduArr : []);

                const expArr: Experience[] = exRes?.data?.data ?? exRes?.data ?? [];
                setExperiences(Array.isArray(expArr) ? expArr : []);

                const uaArr: any[] = uaRes?.data?.data ?? uaRes?.data ?? [];
                const skillNames = Array.isArray(uaArr)
                    ? uaArr
                        .map((u) => u?.Assessment?.skill_name || u?.skill_name)
                        .filter(Boolean)
                    : [];
                setSkills(skillNames);

                const apps = appsRes?.data?.applications
                    ?? appsRes?.data?.data?.applications
                    ?? appsRes?.data?.data?.data
                    ?? appsRes?.data?.data
                    ?? [];
                if (Array.isArray(apps) && apps.length > 0) {
                    const es = apps[0]?.expected_salary;
                    setExpectedSalary(typeof es === "string" ? parseInt(es) : es ?? null);
                }
            } catch (err: any) {
                toast.error(err?.response?.data?.message || err?.message || "Failed to load profile");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchAll();
        return () => {
            mounted = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const mailto = profile?.email ? `mailto:${profile.email}` : undefined;

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
                                src={profile?.profile_picture || "/images/logo.png"}
                                alt={profile?.name || "User"}
                                fill
                                className="rounded-full ring-4 ring-white object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {profile?.name || profile?.username || "Your Name"}
                            </h1>
                            {location && (
                                <div className="mt-1 flex items-center gap-2 text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{location}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 md:self-center">
                            {mailto && (
                                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                                    <a href={mailto}>Contact This Candidate</a>
                                </Button>
                            )}
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
                        <p className="text-gray-700 dark:text-gray-300">
                            {profile?.username
                                ? `Hi, I'm ${profile.name || profile.username}. I am a passionate software engineer focusing on building reliable web applications.`
                                : "Add a short summary about yourself to highlight your experience and goals."}
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
                                        <div className="font-semibold text-gray-900">{edu.university}</div>
                                        <div className="text-sm text-gray-600">{edu.fieldOfStudy} • {edu.degree}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatDateIDDateOnly(edu.startDate)} - {edu.endDate ? formatDateIDDateOnly(edu.endDate) : "Present"}
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
                                        <div className="text-sm text-gray-600">{exp.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {exp.startDate ? formatDateIDDateOnly(exp.startDate) : ""} - {exp.endDate ? formatDateIDDateOnly(exp.endDate) : "Present"}
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Certifications - optional placeholder */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-2">Certification</h2>
                        <div className="text-sm text-gray-500">No certifications added yet.</div>
                    </section>

                    {/* References - optional placeholder cards */}
                    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                        <h2 className="text-xl font-semibold mb-4">References</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[0, 1, 2].map((i) => (
                                <Card key={i} className="shadow-sm">
                                    <CardContent className="p-4 text-gray-700">
                                        <p className="text-sm italic">“Add your references to showcase testimonials from colleagues or managers.”</p>
                                        <div className="mt-3 text-sm text-gray-500">— Your Colleague</div>
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
                    <Button 
                        onClick={handleCTAClick}
                        variant="secondary" 
                        className="self-start md:self-auto"
                    >
                        {user ? "Go to Dashboard" : "Join Now"}
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="rounded-lg bg-white p-4 shadow">Loading...</div>
                </div>
            )}
        </div>
    );
}

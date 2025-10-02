"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ProfileSidebarProps {
    profile: Profile;
    yearsExperience: number | null;
    skills: string[];
}

export default function ProfileSidebar({ profile, yearsExperience, skills }: ProfileSidebarProps) {
    const location = profile?.address || "";

    return (
        <aside className="space-y-6">
            <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
                <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Primary Industry:</span>
                        <span className="font-medium">Information Technology</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium">
                            {yearsExperience !== null ? `${yearsExperience}+ years` : "-"}
                        </span>
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
    );
}
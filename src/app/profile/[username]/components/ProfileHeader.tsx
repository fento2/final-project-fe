"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { isCompanyUser } from "@/helper/companySlugHelper";

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

interface ProfileHeaderProps {
    profile: Profile;
    toAbsolute: (url?: string | null) => string;
    onContactClick: () => void;
}

export default function ProfileHeader({ profile, toAbsolute, onContactClick }: ProfileHeaderProps) {
    const location = profile?.address || "";
    const displayName = profile?.name || profile?.username || "User";

    return (
        <>
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
                                onClick={onContactClick}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isCompanyUser(profile) ? 'View Full Profile' : 'Contact This Candidate'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
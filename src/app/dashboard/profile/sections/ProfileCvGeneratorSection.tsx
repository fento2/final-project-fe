"use client";
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import Image from "next/image";
import type { BackendUser, CVData } from "@/types/cvGenerator";
import CVPreviewWithGenerate from "../components/CVPreviewWithGenerate";
import { Card, CardContent } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { deriveHeadline, deriveSummary, getLatestExperience } from "@/lib/cvHelper";

export default function ProfileCvGeneratorSection() {
    const [cvData, setCvData] = useState<CVData>({
        headline: "",
        summary: "",
        template: "ats",
    });

    const [user, setUser] = useState<BackendUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const subActive = useSubscription();

    const fetchData = async () => {
        let mounted = true;
        setLoading(true);
        setError(null);
        try {
            const res = await apiCall.get("/account/cv/generator");
            const raw = res.data?.data ?? res.data;
            const extracted: BackendUser | null = Array.isArray(raw) ? (raw[0] ?? null) : (raw ?? null);

            if (mounted) {
                setUser(extracted);
                if (extracted && subActive === true) {
                    setCvData(prev => ({
                        ...prev,
                        headline: prev.headline || deriveHeadline(extracted),
                        summary: prev.summary || deriveSummary(extracted),
                    }));
                }
            }
        } catch (e: any) {
            if (mounted) setError(e?.response?.data?.message || e?.message || "Failed to load profile");
        } finally {
            if (mounted) setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [subActive])

    if (subActive === false) return <Card className="mt-6"><CardContent className="text-sm text-gray-700">You don't have an active subscription yet. To use the CV Generator feature, please subscribe first.</CardContent></Card>

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCvData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUseProfile = () => {
        if (!user) return;
        setCvData(prev => ({
            ...prev,
            headline: deriveHeadline(user),
            summary: deriveSummary(user),
        }));
    };

    return (
        <section className="p-6 bg-white rounded-xl shadow-md">
            {loading && <p className="text-sm text-gray-500">Loading profile...</p>}
            {error && <p className="text-sm text-red-600">Error: {error}</p>}

            {!loading && !error && (
                <div>
                    <h2 className="text-xl font-bold mb-4">CV Generator</h2>
                    {user && (
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center gap-4">
                                {user.profiles?.profile_picture && (
                                    <Image width={48} height={48} src={user.profiles.profile_picture} alt={user.profiles?.name || user.name || user.username || "Profile"} className="w-12 h-12 rounded-full object-cover" />
                                )}
                                <div>
                                    <p className="font-semibold">{user.profiles?.name ?? user.name ?? user.username}</p>
                                    <p className="text-sm text-gray-600">{user.profiles?.email ?? user.email}{user.profiles?.phone ? ` • ${user.profiles.phone}` : ""}</p>
                                    {getLatestExperience(user.experience) && (
                                        <p className="text-xs text-gray-500">
                                            Latest: {getLatestExperience(user.experience)?.position} @ {getLatestExperience(user.experience)?.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                            Headline / Title
                        </label>
                        <input
                            type="text"
                            id="headline"
                            name="headline"
                            value={cvData.headline}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            placeholder="Ex: Management Consultant"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                                Summary
                            </label>
                            <button
                                type="button"
                                onClick={handleUseProfile}
                                className="text-xs px-3 py-1 border rounded-md hover:bg-gray-50"
                                title="Auto-fill from profile"
                            >
                                Use Profile Data
                            </button>
                        </div>
                        <textarea
                            id="summary"
                            name="summary"
                            rows={4}
                            value={cvData.summary}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            placeholder="Tuliskan ringkasan singkat tentang dirimu..."
                        />
                    </div>

                    <CVPreviewWithGenerate user={user} cvData={cvData} />
                </div>
            )}
        </section>
    );
}

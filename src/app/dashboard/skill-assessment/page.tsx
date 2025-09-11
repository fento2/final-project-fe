"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/apiCall";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SkillAssessment {
    assessment_id: number;
    skill_name: string;
    description?: string;
}

export default function SkillAssessmentListPage() {
    const router = useRouter();
    const [data, setData] = useState<SkillAssessment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [totalSkillAssessments, setTotalSkillAssessments] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await apiCall.get("/skillAssessments");
            setData(res.data?.data || res.data || []);
        } catch (e: any) {
            setError(
                e?.response?.data?.message || e?.message || "Failed to load data"
            );
        } finally {
            setLoading(false);
        }
    }

    const checkSubscription = async () => {
        try {
            const { data } = await apiCall.get("/userAssessments");
            setTotalSkillAssessments(data.data.length);
        } catch (error: any) {
            setError(error.response.data.message || error.message || "Failed to check subscription")
        }
    }

    useEffect(() => {
        fetchData();
        checkSubscription();
    }, []);

    const toSlug = (a: SkillAssessment) => {
        const kebab = a.skill_name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return `${a.assessment_id}-${kebab}`;
    };

    // const handleStart = (item: SkillAssessment) => router.push(`/dashboard/skill-assessment/${toSlug(item)}/take`);
    const handleView = (item: SkillAssessment) => router.push(`/dashboard/skill-assessment/${toSlug(item)}`);

    const skeletons = Array.from({ length: 4 });

    return (
        <div className="p-4 pl-20 space-y-6">
            <Badge className="bg-green-600 hover:bg-green-700">Total skills taken (last 30 days): {totalSkillAssessments}</Badge>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Skill Assessments
                </h1>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    onClick={fetchData}
                >
                    {loading ? "Loading..." : "Refresh"}
                </Button>
            </div>

            {error && (
                <div className="text-sm rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-600">
                    {error}
                </div>
            )}

            {
                totalSkillAssessments > 2 && (
                    <div className="text-sm rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-600">
                        You've already taken skill assessments twice in the last 30 days. To increase your quota and continue taking more assessments, please subscribe to a plan.
                    </div>
                )
            }

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading &&
                    data.length === 0 &&
                    skeletons.map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-xl border bg-white shadow-md animate-pulse"
                        >
                            <div className="h-40 w-full bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                <div className="h-8 w-full bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))
                }

                {data.map((item) => (
                    <Card
                        key={item.assessment_id}
                        className="flex flex-col pt-0 overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-shadow"
                        onClick={totalSkillAssessments > 2 ? undefined : () => handleView(item)}
                    >
                        <CardHeader className="p-0">
                            <div className="relative w-full h-40">
                                <Image
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                                    alt={item.skill_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="">
                            <h2 className="text-base font-semibold line-clamp-1">
                                {item.skill_name}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {item.description || "No description provided."}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm" onClick={() => handleView(item)} className="w-full" disabled={totalSkillAssessments > 2} >
                                Detail
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div >
    );
}
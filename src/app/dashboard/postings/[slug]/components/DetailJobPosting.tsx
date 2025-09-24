"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ManagePosting from "./ManagePostings";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/helper/apiCall";
import { useEffect } from "react";
import { toTitleCase } from "@/helper/toTitleCase";
import ReadOnlyQuill from "@/app/dashboard/components/ReadOnlyReactQuil";
import PreselectionControl from "./BottomSection";
import { useJobDetailStore } from "@/lib/zustand/detailJobStore";

const DetailPostingWithApplicant = () => {
    const { slug } = useParams();
    const job = useJobDetailStore((state) => state.jobDetail);
    const setJob = useJobDetailStore((state) => state.setJobDetail);
    const getDetailJob = async () => {
        try {
            const { data } = await apiCall.get(`/postings/get-detail/${slug}`);
            if (data.success) setJob(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getDetailJob();
    }, [slug]);

    if (!job) {
        return (
            <Card className="relative lg:col-span-2 border border-gray-200 shadow-md rounded-xl bg-white order-1 animate-pulse">
                <CardHeader className="px-6 pt-6 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent className="px-6 py-4 space-y-3">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <div key={idx} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="relative lg:col-span-2 border border-gray-200 shadow-md rounded-xl bg-white order-1">
            <CardHeader className="px-6">
                <CardTitle className="text-lg sm:text-xl md:text-3xl font-bold tracking-wide">
                    {job.title}
                </CardTitle>
            </CardHeader>

            <CardContent className=" px-6 thin-scrollbar">
                {/* About This Job */}
                <section className="border-b border-gray-200 pb-6 md:pb-8">
                    <h2 className="text-base sm:text-lg md:text-2xl font-semibold tracking-wide mb-4 md:mb-6 border-b border-gray-200 pb-1">
                        About This Job
                    </h2>
                    <ReadOnlyQuill value={job.description} className="text-base leading-relaxed text-gray-700" />
                </section>

                {/* Info Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                    {[
                        { label: "Category", value: toTitleCase(job.category) },
                        { label: "Location", value: job.location },
                        { label: "Salary", value: `${toTitleCase(job.currency)} ${job.salary.toLocaleString()} / ${toTitleCase(job.periodSalary)}` },
                        { label: "Type", value: toTitleCase(job.job_type) },
                        { label: "Posted", value: new Date(job.createdAt).toLocaleDateString() },
                        { label: "Expires", value: new Date(job.expiredAt).toLocaleDateString() },
                    ].map((info, idx) => (
                        <div key={idx} className="space-y-1">
                            <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 uppercase tracking-wide">
                                {info.label}
                            </p>
                            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                                {info.value}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 border-b border-gray-200 pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((s) => (
                                <Badge
                                    key={s.id}
                                    variant="secondary"
                                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base bg-indigo-100 text-indigo-800 hover:bg-indigo-200 rounded-full transition-colors"
                                >
                                    {s.name}
                                </Badge>
                            ))}
                        </div>
                    </section>
                )}
            </CardContent>
            <CardFooter>
                <PreselectionControl initialEnabled={job.preselection_test} getDetailJob={getDetailJob} />
            </CardFooter>
            <ManagePosting slug={slug as string} />
        </Card>
    );
};

export default DetailPostingWithApplicant;

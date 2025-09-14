"use client";
import React, { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { Company } from "@/types/userCompany";
import Image from "next/image";
import { StarRating } from "@/components/core/StarRating";

type UserMinimal = {
    name: string;
    avatarUrl?: string;
};

type UserCompanyMinimal = {
    user_company_id: number;
    user?: UserMinimal;
    position?: string;
};

type Review = {
    review_id: number;
    user_company_id: number;
    salary_estimate?: number;
    rating_culture?: number;
    rating_work_life_balance?: number;
    rating_facilities?: number;
    rating_career?: number;
    createAt: string;
    updatedAt?: string;
    user_company?: UserCompanyMinimal;
};

type ReviewSectionProps = {
    companyName?: string;
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function ReviewSection({ companyName }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyName) return;

        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await apiCall.get(`/company/name/${companyName}`);
                const company: Company = res.data.data;
                if (company) {
                    const { data } = await apiCall.get(`/reviewCompany/${company.company_id}`)
                    console.log(data.data);
                    if (data.data) {
                        setReviews(data.data);
                    }
                }
            } catch (err) {
                // console.error("Failed to fetch reviews:", err);
                setError("Gagal memuat review");
            } finally {
                setLoading(false)
            }
        };

        fetchReviews();
    }, [companyName])

    const total = reviews?.length ?? 0;
    const avg = total === 0 ? 0
        : reviews.reduce((acc, r) => { const parts = [r.rating_culture ?? 0, r.rating_work_life_balance ?? 0, r.rating_facilities ?? 0, r.rating_career ?? 0,]; const sum = parts.reduce((a, b) => a + b, 0); return acc + sum / parts.length; }, 0) / total;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Ulasan untuk {companyName ?? "Perusahaan"}</h2>
                    <p className="text-sm text-gray-500">{total} review</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
                    <StarRating value={avg} size={18} />
                </div>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading && !total && (
                <div className="rounded-xl border bg-white p-6 text-center text-gray-600">Memuat review...</div>
            )}

            {!loading && !total && !error && (
                <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
                    Belum ada review. Jadilah yang pertama memberikan ulasan.
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {reviews.map((r) => {
                    const user = r.user_company?.user;
                    const ratingParts = [
                        r.rating_culture ?? 0,
                        r.rating_work_life_balance ?? 0,
                        r.rating_facilities ?? 0,
                        r.rating_career ?? 0,
                    ];
                    const ratingAvg =
                        ratingParts.every((v) => v === 0) ? 0 : ratingParts.reduce((a, b) => a + b, 0) / ratingParts.length;

                    return (
                        <div
                            key={r.review_id}
                            className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {user?.avatarUrl ? (
                                        <Image width={40} height={40} src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center text-sm font-semibold">
                                            {initials(user?.name ?? "U")}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium leading-5">{user?.name ?? `User #${r.user_company_id}`}</div>
                                        <div className="text-xs text-gray-500">{formatDate(r.createAt)}</div>
                                    </div>
                                </div>

                                <StarRating value={ratingAvg} />
                            </div>

                            <div className="mt-3">
                                {r.salary_estimate != null && (
                                    <div className="text-xs text-gray-500 mb-1">Estimasi gaji: {r.salary_estimate}</div>
                                )}
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-xs font-semibold text-gray-700">Culture</div>
                                    <div className="text-sm text-gray-800">{r.rating_culture ?? "-"}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-xs font-semibold text-gray-700">Work-life</div>
                                    <div className="text-sm text-gray-800">{r.rating_work_life_balance ?? "-"}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-xs font-semibold text-gray-700">Facilities</div>
                                    <div className="text-sm text-gray-800">{r.rating_facilities ?? "-"}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3">
                                    <div className="text-xs font-semibold text-gray-700">Career</div>
                                    <div className="text-sm text-gray-800">{r.rating_career ?? "-"}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
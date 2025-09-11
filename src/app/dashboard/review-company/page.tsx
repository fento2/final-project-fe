"use client";

import React, { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { formatDateIDDateOnly } from "@/lib/formatDate";

type Review = {
    review_id: number;
    experience_id?: number;
    company: string;
    rating: number; // 1..5
    comment?: string | null;
    created_at?: string;
};

export default function ReviewCompanyPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchReviews = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await apiCall.get("/reviews/me");
            const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
            const normalized: Review[] = (list as any[]).map((r, idx) => ({
                review_id: r.review_id ?? r.id ?? idx + 1,
                experience_id: r.experience_id ?? r.Experience?.experience_id,
                company: r.company ?? r.Experience?.name ?? "Unknown Company",
                rating: Number(r.rating ?? 0),
                comment: r.comment ?? r.review ?? "",
                created_at: r.created_at ?? r.createdAt ?? r.created_at_iso ?? "",
            }));
            setReviews(normalized);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data review.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const renderStars = (n: number) => {
        const filled = Math.max(0, Math.min(5, Math.floor(n)));
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < filled ? "text-yellow-500" : "text-gray-300"}>★</span>
                ))}
                <span className="ml-1 text-sm text-gray-600">{n}/5</span>
            </div>
        );
    };

    return (
        <div className="p-4 pl-20 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">My Company Reviews</h1>
                <button
                    onClick={fetchReviews}
                    className="px-3 py-2 text-sm rounded border hover:bg-gray-50"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading && reviews.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-xl border bg-white shadow-md animate-pulse">
                            <div className="h-28 w-full bg-gray-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))
                }

                {!loading && reviews.length === 0 && (
                    <div className="col-span-full text-center text-gray-600">
                        Belum ada review perusahaan.
                    </div>
                )}

                {reviews.map((rv) => (
                    <Card key={rv.review_id} className="overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{rv.company}</CardTitle>
                            <CardDescription className="flex items-center justify-between">
                                <span>{rv.created_at ? formatDateIDDateOnly(rv.created_at) : "-"}</span>
                                {renderStars(rv.rating)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                {rv.comment?.trim() ? rv.comment : "Tidak ada komentar."}
                            </p>
                        </CardContent>
                        <CardFooter className="text-xs text-gray-500">
                            {rv.experience_id ? `Experience ID: ${rv.experience_id}` : ""}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
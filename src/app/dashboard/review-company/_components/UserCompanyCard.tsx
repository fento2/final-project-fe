import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { Review, UserCompanyItem } from "@/types/userCompany";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/core/StarRating";
import { Separator } from "@/components/ui/separator";

function stripHtml(html?: string | null) {
    return typeof html === "string" ? html.replace(/<[^>]+>/g, "").trim() : "";
}
function avgRating(r?: Review) {
    if (!r) return 0;
    const vals = [r.rating_culture, r.rating_work_life_balance, r.rating_facilities, r.rating_career].filter(v => typeof v === "number");
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export default function UserCompanyCard({ it, onReview, onDelete }: { it: UserCompanyItem, onReview?: () => void, onDelete: () => void }) {
    const review = it.reviews ?? undefined;
    const average = avgRating(review);

    return (
        <Card className="overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="">
                <CardTitle className="text-base flex justify-between items-center">
                    {it.company?.name}
                    {
                        it.company.company_id && (
                            <Button
                                variant="link"
                                className="cursor-pointer text-green-700"
                                onClick={(e) => { e.stopPropagation(); onReview?.(); }}
                            >
                                Review
                            </Button>
                        )
                    }
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                    <span>{it.start_date ? formatDateIDDateOnly(it.start_date) : "-"} - {it.end_date ? formatDateIDDateOnly(it.end_date) : "Present"}</span>
                    {/* {it.company?.website ? <a href={it.company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Website</a> : null} */}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="h-20 overflow-hidden">
                    {it.company?.description && (
                        <p className="text-sm text-gray-800 line-clamp-4 whitespace-normal break-words">
                            {stripHtml(it.company.description)}
                        </p>
                    )}
                </div>
                <Separator></Separator>
                <div className="flex justify-between items-center">
                    {it.company?.email ? <span>{it.company.name}</span> : null}
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={() => onDelete()}>Delete</Button>
                </div>
                <Separator></Separator>
            </CardContent>

            <CardFooter className="text-xs text-gray-500 flex flex-wrap gap-4 justify-between">
                {/* {it.company?.phone ? <span>{it.company.phone}</span> : null} */}
                {review ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rata-rata penilaian</span>
                            {<StarRating value={average} size={18} />}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 rounded bg-gray-100">Culture: {review.rating_culture}/5</span>
                            <span className="px-2 py-1 rounded bg-gray-100">Work-Life: {review.rating_work_life_balance}/5</span>
                            <span className="px-2 py-1 rounded bg-gray-100">Facilities: {review.rating_facilities}/5</span>
                            <span className="px-2 py-1 rounded bg-gray-100">Career: {review.rating_career}/5</span>
                        </div>
                        {typeof review.salary_estimate === "number" && <div className="text-sm text-gray-700">Estimasi gaji: <span className="font-medium">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(review.salary_estimate)}</span></div>}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Belum ada review untuk perusahaan ini.</p>
                )}
            </CardFooter>
        </Card>
    );
}
"use client";
import React, { useState } from "react";
import { useUserCompanies } from "@/hooks/useUserCompany";
import UserCompanyCard from "./_components/UserCompanyCard";
import AddUserCompanyModal from "./_components/AddUserCompanyModal";
import ReviewCompanyModal from "./_components/ReviewCompanyModal";
import { UserCompanyItem } from "@/types/userCompany";
import { apiCall } from "@/helper/apiCall";
import { useAuthRole } from "@/helper/useAuthRole";

export default function ReviewCompanyPage() {
    useAuthRole('USER')
    const { items, loading, error, refetch } = useUserCompanies();
    const [addOpen, setAddOpen] = useState(false);

    const [reviewOpen, setReviewOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<UserCompanyItem>();

    const openReview = (it: UserCompanyItem) => {
        setSelectedCompany(it);
        setReviewOpen(true);
    };

    const onDelete = async (user_company_id: number, review_id?: number) => {
        try {
            if (review_id) {
                await apiCall.delete(`/reviewCompany/${review_id}`);
            }
            if (user_company_id) {
                await apiCall.delete(`/user-companies/${user_company_id}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            refetch();
        }
    }

    return (
        <div className="p-4 md:pl-20 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Riwayat & Review Perusahaan</h1>
                <div className="flex gap-2">
                    <button onClick={() => setAddOpen(true)} className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
                    <button
                        onClick={refetch}
                        className="px-3 py-2 text-sm rounded border hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading && items.length === 0 &&
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

                {!loading && items.length === 0 && (
                    <div className="col-span-full text-center text-gray-600">
                        Belum ada riwayat perusahaan.
                    </div>
                )}

                {/* {items.map((it) => <UserCompanyCard key={it.user_company_id} it={it} />)} */}
                {items.map((it) => <UserCompanyCard key={it.user_company_id} it={it} onReview={() => openReview(it)} onDelete={() => onDelete(it.user_company_id, it.reviews?.review_id)} />)}
            </div>

            <AddUserCompanyModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSaved={() => {
                    setAddOpen(false);
                    refetch();
                }}
            />
            {
                reviewOpen && selectedCompany && (
                    <ReviewCompanyModal
                        isOpen={reviewOpen}
                        item={selectedCompany}
                        onClose={() => setReviewOpen(false)}
                        onSaved={() => {
                            setReviewOpen(false);
                            refetch();
                        }}
                    />
                )
            }
        </div>
    );
}
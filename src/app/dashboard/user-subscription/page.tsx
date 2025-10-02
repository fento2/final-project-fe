"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import formatDateID from "@/lib/formatDate";
import { UserSubscriptionsGetDTO, UserSubscriptionUpdateShcema } from "@/types/userSubscription";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import SubmitDialog from "../skill-assessment/_components/SubmitDialog";
import Image from "next/image";
import { useAuthRole } from "@/helper/useAuthRole";

export default function UserSubscriptionPage() {
    useAuthRole('DEVELOPER')
    const [data, setData] = useState<UserSubscriptionsGetDTO[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const closeImage = () => setSelectedImage(null);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await apiCall.get("/userSubscription/user-subscription");
            setData(data.data);
            console.log(data.data);
        } catch (error: any) {
            setError(error.response.data.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (user_subscription_id: number) => {
        try {
            setLoading(true);
            setError("");
            const result = await apiCall.patch(`/userSubscription/${user_subscription_id}`, { payment_status: "APPROVED" });
            if (result.status === 200) {
                fetchData();
            }
        } catch (error: any) {
            setError(error.response.data.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async (user_subscription_id: number) => {
        try {
            setLoading(true);
            setError("");
            const result = await apiCall.patch(`/userSubscription/${user_subscription_id}`, { payment_status: "REJECTED" });
            if (result.status === 200) {
                fetchData();
            }
        } catch (error: any) {
            setError(error.response.data.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full px-3 py-4 md:pl-26 md:pr-10">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">User Subscription</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={fetchData}
                        disabled={loading}
                        variant="outline"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] table-fixed border-collapse">
                        <colgroup>
                            <col className="w-10" />
                            <col className="w-40" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                        </colgroup>
                        <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">No</th>
                                <th className="px-4 py-2 text-left font-medium">User ID</th>
                                <th className="px-4 py-2 text-left font-medium">Subscription Name</th>
                                <th className="px-4 py-2 text-left font-medium">Start Date</th>
                                <th className="px-4 py-2 text-left font-medium">End Date</th>
                                <th className="px-4 py-2 text-left font-medium">Created At</th>
                                <th className="px-4 py-2 text-left font-medium">Updated At</th>
                                <th className="px-4 py-2 text-left font-medium">Payment Status</th>
                                <th className="px-4 py-2 text-left font-medium">Proof of Payment</th>
                                <th className="px-4 py-2 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                                        No data
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && data.map((item, idx) => (
                                <tr key={item.userSubscriptionSchema.user_id}>
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.user_id}</td>
                                    <td className="px-4 py-2">{item.subscription.name}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.start_date && formatDateID(item.userSubscriptionSchema.start_date.toString())}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.end_date && formatDateID(item.userSubscriptionSchema.end_date.toString())}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.createAt && formatDateID(item.userSubscriptionSchema.createAt.toString())}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.updatedAt && formatDateID(item.userSubscriptionSchema.updatedAt.toString())}</td>
                                    <td className="px-4 py-2">{item.userSubscriptionSchema.payment_status}</td>
                                    <td className="px-4 py-2">
                                        {
                                            item.userSubscriptionSchema.proof_url && (
                                                <button type="button" onClick={() => setSelectedImage(item.userSubscriptionSchema.proof_url || null)} className="p-0 border-0 bg-transparent cursor-pointer">
                                                    <Image width={48} height={48} src={item.userSubscriptionSchema.proof_url} alt={item.subscription.name} />
                                                </button>
                                            )
                                        }
                                    </td>
                                    <td className="px-2 py-1">
                                        {
                                            item.userSubscriptionSchema.payment_status === "PENDING" && (
                                                <div className="flex gap-2">
                                                    <SubmitDialog variant="delete" onConfirm={() => handleReject(item.userSubscriptionSchema.user_subscription_id)} buttonTitle="Reject" triggerLabel="Reject" title="Reject subscription?" description={`Reject subscription (ID User : ${item.userSubscriptionSchema.user_id}) - (Subscription name : ${item.subscription.name})?`} />
                                                    <SubmitDialog variant="success" onConfirm={() => handleApprove(item.userSubscriptionSchema.user_subscription_id)} buttonTitle="Approve" triggerLabel="Approve" title="Approve subscription?" description={`Approve subscription (ID User : ${item.userSubscriptionSchema.user_id}) - (Subscription name : ${item.subscription.name})?`} />
                                                </div>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={closeImage}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                >
                    <div onClick={(e) => e.stopPropagation()} className="relative max-w-[90vw] max-h-[90vh]">
                        <button
                            onClick={closeImage}
                            className="absolute top-2 right-2 z-50 rounded bg-white/80 px-2 py-1 text-sm"
                        >
                            Close
                        </button>
                        {/* using native img for natural sizing inside the modal */}
                        <img src={selectedImage} alt="Proof" className="max-w-full max-h-[85vh] rounded shadow-lg" />
                    </div>
                </div>
            )}
        </div>
    )
}
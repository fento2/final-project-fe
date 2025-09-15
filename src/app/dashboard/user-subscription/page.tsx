"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import formatDateID from "@/lib/formatDate";
import { UserSubscriptionsGetDTO } from "@/types/userSubscription";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserSubscriptionPage() {
    const [data, setData] = useState<UserSubscriptionsGetDTO[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                                    <td className="px-2 py-1">
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
import React from "react";
import formatCurrency from "@/lib/formatCurrency";
import formatDateID from "@/lib/formatDate";
import { UserSubscriptionActiveDTO } from "@/types/userSubscription";

interface Props {
    data: UserSubscriptionActiveDTO[];
    loading: boolean;
    error?: string;
}

export default function SubscriptionTable({ data, loading, error = "" }: Props) {
    return (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] table-fixed border-collapse">
                    <colgroup>
                        <col className="w-10" />
                        <col className="w-48" />
                        <col className="w-40" />
                        <col className="w-48" />
                        <col className="w-48" />
                    </colgroup>
                    <thead className="bg-gray-50 text-sm text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium">No</th>
                            <th className="px-4 py-2 text-left font-medium">Name</th>
                            <th className="px-4 py-2 text-left font-medium">Price</th>
                            <th className="px-4 py-2 text-left font-medium">Created At</th>
                            <th className="px-4 py-2 text-left font-medium">Updated At</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-red-500">
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    No data
                                </td>
                            </tr>
                        )}

                        {!loading && !error && data.map((item, idx) => (
                            <tr key={item.subscription_id}>
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{item.subscription.name}</td>
                                <td className="px-4 py-2">{formatCurrency(item.subscription.price)} / month</td>
                                <td className="px-4 py-2">{item.createAt && formatDateID(item.createAt.toString())}</td>
                                <td className="px-4 py-2">{item.updatedAt && formatDateID(item.updatedAt.toString())}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
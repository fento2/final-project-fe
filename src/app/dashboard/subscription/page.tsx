"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import formatDateID from "@/lib/formatDate";
import { Subscription } from "@/types/subscription";
import { Pencil, Plus, RefreshCw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import CreateSubscriptionModal from "./_components/CreateSubscriptionModal";
import formatCurrency from "@/lib/formatCurrency";
import UpdateSubscriptionModal from "./_components/UpdateSubscriptionModal";
import SubmitDialog from "../skill-assessment/_components/SubmitDialog";
import { useAuthRole } from "@/helper/useAuthRole";

export default function SubscriptionPage() {
    useAuthRole('COMPANY')
    const [data, setData] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [selected, setSelected] = useState<Subscription | null>(null);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await apiCall.get("/subscription");
            setData(data.data);
        } catch (error: any) {
            setError(error.response.data.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (subscription_id: number) => {
        try {
            setLoading(true);
            setError("");
            const res = await apiCall.delete(`/subscription/${subscription_id}`);
            if (res.status === 200) {
                fetchData();
            }
        } catch (error: any) {
            setError(error.response.data.message || "Failed to delete data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full px-3 py-4 md:pl-26 md:pr-10">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">Subscription</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={fetchData}
                        disabled={loading}
                        variant="outline"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setShowCreate(true)}
                        className="bg-green-700 hover:bg-green-800"
                    >
                        <Plus className="w-4 h-4" />
                        New
                    </Button>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] table-fixed border-collapse">
                        <colgroup>
                            <col className="w-10" />
                            <col className="w-64" />
                            <col className="w-64" />
                            <col className="w-48" />
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
                                <th className="px-4 py-2 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                        No data
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && data.map((item, idx) => (
                                <tr key={item.subscription_id}>
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{formatCurrency(item.price)} / month</td>
                                    <td className="px-4 py-2">{item.createAt && formatDateID(item.createAt.toString())}</td>
                                    <td className="px-4 py-2">{item.updatedAt && formatDateID(item.updatedAt.toString())}</td>
                                    <td className="px-2 py-1">
                                        <div className="grid lg:flex lg:flex-wrap items-center gap-1">
                                            <Button variant="outline" onClick={() => { setSelected(item); setShowUpdate(true); }}><Pencil />Edit</Button>
                                            <SubmitDialog
                                                onConfirm={async () => {
                                                    await handleDelete(item.subscription_id);
                                                    fetchData();
                                                }}
                                                title="Yakin ingin menghapus?"
                                                triggerLabel="Delete"
                                                description={`Anda akan menghapus subscription ${item.name}.`}
                                                buttonTitle="Delete"
                                                variant="delete"
                                                icon={<Trash />}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateSubscriptionModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={() => fetchData()}
            />

            <UpdateSubscriptionModal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                item={selected}
                onCreated={() => fetchData()}
            />
        </div>
    )
}
"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import formatDateID from "@/lib/formatDate";
import { Eye, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CreateSkillModal from "./components/CreateSkillModal";
import { SkillAssessment } from "@/types/skillAssessment";
import UpdateSkillModal from "./components/UpdateSkillModal";
import ViewSkillModal from "./components/ViewSkillModal";

const ListSKillAssessmentPage = () => {
    const [data, setData] = useState<SkillAssessment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [selected, setSelected] = useState<SkillAssessment | null>(null);
    const [showView, setShowView] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await apiCall.get("/skillAssessments");
            setData(res.data?.data || res.data || []);
        } catch (e: any) {
            setError(e.response?.data?.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this assessment?")) return;
        try {
            await apiCall.delete(`/questions/${id}`)
            await apiCall.delete(`/skillAssessments/${id}`);
            setData(d => d.filter(item => item.assessment_id !== id));
        } catch (e: any) {
            alert(e.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="w-full px-3 py-4 md:pl-26 md:pr-10">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">Skill Assessments</h1>
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
                        className="bg-green-600 hover:bg-green-700"
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
                            <col className="w-20" />
                            <col className="w-64" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-40" />
                        </colgroup>
                        <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">ID</th>
                                <th className="px-4 py-2 text-left font-medium">Skill Name</th>
                                <th className="px-4 py-2 text-left font-medium">Created At</th>
                                <th className="px-4 py-2 text-left font-medium">Updated At</th>
                                <th className="px-4 py-2 text-left font-medium">Actions</th>
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
                                <tr
                                    key={item.assessment_id}
                                    className="border-t border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2 font-medium text-gray-800">{item.skill_name}</td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {formatDateID(item.createAt)}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {formatDateID(item.updatedAt)}
                                    </td>
                                    <td className="px-2 py-1">
                                        <div className="grid lg:flex lg:flex-wrap items-center gap-1">
                                            <Button
                                                onClick={() => { setSelected(item); setShowView(true); }}
                                                className="p-1 bg-gray-600 hover:bg-gray-700"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                            <Button
                                                onClick={() => { setSelected(item); setShowUpdate(true); }}
                                                className="p-1 bg-blue-600 hover:bg-blue-700"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(item.assessment_id)}
                                                className="p-1 bg-red-600 hover:bg-red-700"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateSkillModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={(item) => setData(d => [item, ...d])}
            />

            <UpdateSkillModal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                item={selected}
                onUpdated={(u) => setData(d => d.map(x => x.assessment_id === u.assessment_id ? u : x))}
            />

            <ViewSkillModal
                isOpen={showView}
                onClose={() => setShowView(false)}
                item={selected}
            />
        </div>
    )
}

export default ListSKillAssessmentPage;
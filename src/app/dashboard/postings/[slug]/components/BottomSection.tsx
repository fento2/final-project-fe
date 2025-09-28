"use client";

import { Button } from "@/components/ui/button";
import { Dots_v2 } from "@/components/ui/spinner";
import { apiCall } from "@/helper/apiCall";
import { IQuestion, usePreselectionStore } from "@/lib/zustand/preselectionStore";
import { Plus, Edit, CheckCircle, Slash, ClipboardList, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/basic-toast";

interface PreselectionControlProps {
    initialEnabled: boolean;
    getDetailJob: () => Promise<void>
}

const PreselectionControl = ({ initialEnabled, getDetailJob }: PreselectionControlProps) => {
    const { setShowForm, setQuestions, setMinScore, resetQuestions } = usePreselectionStore();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingActiveOrDeactivate, setLoadingActiveORDeactive] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const getDetailPreselection = async () => {
        try {
            setLoading(true);
            const { data } = await apiCall.get(`/preselection/detail/${slug}`);
            if (data.success) {
                const dataQuestions: IQuestion[] = data.data.selection_questions.map((q: any) => ({
                    question: q.question,
                    options: [q.option_A, q.option_B, q.option_C, q.option_D],
                    answer: q.correct_option,
                }));

                setQuestions(dataQuestions);
                setMinScore(data.data.passingScore);
                setShowForm(true);
                router.replace(
                    `/dashboard/postings/${slug}?action=edit&selection-id=${data.data.selection_id}`
                );
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    const deactivePreselectionTest = async () => {
        try {
            setLoadingActiveORDeactive(true);
            const { data } = await apiCall.patch(`/preselection/deactive/${slug}`);
            if (data.success) {
                toast.success(data.message);
                setShowForm(false);
                getDetailJob()
                resetQuestions()
                router.replace(
                    `/dashboard/postings/${slug}`
                );
            }
        } catch (error) {
            toast.error("Failed to deactivate preselection test");
        } finally {
            setLoadingActiveORDeactive(false);
        }
    };
    const checkIfAlreadyHavePreselectionTest = async () => {
        try {
            setLoadingActiveORDeactive(true)
            const { data } = await apiCall.get(`/preselection/active/${slug}`)
            if (data.success) {
                if (data.data) {
                    getDetailJob()
                } else {
                    setShowForm(true)
                }
            }
        } catch (error) {
        } finally {
            setLoadingActiveORDeactive(false)
        }
    }
    return (
        <section className="mt-6 p-4 border rounded-lg bg-white shadow-sm w-full">
            <div className="flex items-center gap-3 mb-2">
                {/* Logo/Icon */}
                <ClipboardList className="w-6 h-6 text-indigo-500" />
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        Preselection Test
                        {initialEnabled && <CheckCircle className="text-green-600 w-5 h-5" />}
                    </h2>
                    {/* Subjudul / deskripsi */}
                    <p className="text-sm text-gray-500">
                        Manage and configure your preselection test for this job posting. Activate, edit, or deactivate as needed.
                    </p>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                {initialEnabled ? (
                    <>
                        {/* Deactivate Button */}
                        <Button
                            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                            onClick={deactivePreselectionTest}
                            disabled={loadingActiveOrDeactivate}
                        >
                            {loadingActiveOrDeactivate ? <Dots_v2 /> : <><XCircle size={16} /> Deactive</>}
                        </Button>

                        {/* Edit Button */}
                        <Button
                            className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2"
                            onClick={getDetailPreselection}
                        >
                            {loading ? <Dots_v2 /> : <> <Edit size={16} /> Edit </>}
                        </Button>
                    </>
                ) : (
                    <Button
                        className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2"
                        onClick={() => checkIfAlreadyHavePreselectionTest()}
                    >
                        {loadingActiveOrDeactivate ? <Dots_v2 /> : <> <Plus size={16} />Active</>}
                    </Button>
                )}
            </div>
        </section>

    );
};

export default PreselectionControl;

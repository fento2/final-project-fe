"use client";
import { apiCall } from "@/helper/apiCall";
import { SkillAssessment } from "@/types/skillAssessment";
import { UserAssessmentDTO } from "@/validation/userAssessment.validation";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type rawSchema = {
    user_assessment_id: number,
    score: number,
}

type ResultPage = UserAssessmentDTO & {
    assessment: SkillAssessment,
}

export default function ResultSKillAssessmentPage() {
    const router = useRouter();
    const raw = localStorage.getItem("lastResult");
    const resultRaw: rawSchema = raw ? JSON.parse(raw) : null;
    const [data, setData] = useState<ResultPage>();

    const fetchData = async () => {
        try {
            const result = await apiCall.get(`/userAssessments/${resultRaw.user_assessment_id}`);

            setData(result.data.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!data) {
        return <div className="flex justify-center items-center h-screen"><p>Could not display results.</p></div>;
    }

    const passingScore = 75;
    const isPassed = (data.score ?? 0) >= passingScore;

    return (
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 65px)" }}>
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border p-8 text-center space-y-6">
                {isPassed ? (
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                ) : (
                    <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                )}

                <header>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isPassed ? "Congratulations! You Passed." : "Keep Practicing!"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here is your result for the {data.assessment?.skill_name ?? 'Skill Assessment'}.
                    </p>
                </header>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <p className="text-sm font-medium text-indigo-700">YOUR SCORE</p>
                    <p className="text-6xl font-bold text-indigo-900 my-2">{data.score ?? 0}<span className="text-3xl text-indigo-500">/100</span></p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Taken on: {data.date_taken ? new Date(data.date_taken).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                    </div>
                </div>

                <footer className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/dashboard/my-skill">
                        <button className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                            View My Skills
                        </button>
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Back to Assessments
                    </button>
                </footer>
            </div>
        </div>
    )
}
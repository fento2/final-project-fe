"use client";
import { ParsedQuestion } from "@/app/dashboard/list-skill-assessment/types/questionAssessment";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SubmitDialog from "../../_components/SubmitDialog";
import { UserAssessmentUpdateDTO } from "@/validation/userAssessment.validation";
import { formatTime } from "@/lib/formatTime";

export default function SkillAssessmentPage() {
    const router = useRouter();
    const user = useAuthStore();
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? "";
    const [current, setCurrent] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120 * 60);
    const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [time, setTime] = useState();

    const fetchData = async () => {
        const { data } = await apiCall.get(`/questions/${slug[0]}`);
        setQuestions(data.data);
        setAnswer(new Array(data.data.length).fill(''));
    }

    useEffect(() => {
        try {
            const start = new Date(time as any);
            if (isNaN(start.getTime())) {
                setTimeLeft(2 * 60 * 60);
            } else {
                const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
                const end = new Date(start.getTime() + TWO_HOURS_MS);
                const remainingSec = Math.max(0, Math.ceil((end.getTime() - Date.now()) / 1000));
                setTimeLeft(remainingSec);
            }
        } catch {
            setTimeLeft(2 * 60 * 60);
        }

        const t = setInterval(() => {
            setTimeLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        fetchData();
        return () => clearInterval(t);
    }, [time]);

    useEffect(() => {
        const raw = localStorage.getItem("takeAssessment");

        if (raw) {
            const parsed = JSON.parse(raw);
            setTime(parsed.date_taken);
        } else {
            router.replace(`/dashboard/skill-assessment`);
            return;
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Ujian sedang berlangsung. Yakin ingin meninggalkan halaman?';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    const handleAnswer = (opt: string) => {
        // setAnswers((a) => ({ ...a, [current]: opt })); setAnswer((a) => ({ ...a, [current]: opt }));
        setAnswer((prev) => { const data = [...prev]; data[current] = opt; return data; })
    };

    const handleSubmit = async () => {
        let score = 0;
        questions.forEach((val, idx) => {
            if (val.correct_option === answer[idx]) {
                score += 100 / questions.length;
            };
        });

        const raw = localStorage.getItem("takeAssessment");
        let user_assessment_id: number | null = null;

        if (raw) {
            const parsed = JSON.parse(raw);
            const candidate = parsed && typeof parsed === "object" ? parsed.user_assessment_id ?? parsed : parsed;
            const n = Number(candidate);
            user_assessment_id = isNaN(n) ? null : n;
        }

        const payload: UserAssessmentUpdateDTO = {
            user_assessment_id: Number(user_assessment_id),
            score
        }
        const { data } = await apiCall.patch("/userAssessments", payload);
        localStorage.removeItem("takeAssessment");
        router.push(`/dashboard/skill-assessment/${slug}/result`)
    }

    const handleNext = () => {
        setCurrent((c) => Math.min(questions.length - 1, c + 1));
    };

    const currentQuestion = questions[current];

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50 py-8 pl-24 px-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl font-bold">Sistem Ujian Online</h1>
                <div className="text-sm text-gray-700">
                    <div className="inline-block bg-white px-4 py-2 rounded shadow">
                        Sisa waktu: <span className="font-medium">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Identity */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-gray-600">Mata Kuliah: <span className="font-semibold">{params.slug}</span></p>
                    <p className="text-lg font-semibold">{user.email}</p>
                </div>
            </div>

            {/* Main area */}
            <div className="">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow p-6 mb-4">
                        <div className="mb-4">
                            <div className="text-sm text-gray-500">Soal {current + 1}/{questions.length || 0}</div>
                            <h2 className="text-lg font-semibold mt-2">{currentQuestion ? currentQuestion.question : "memuat soal..."}</h2>
                        </div>
                        <form>
                            <div className="space-y-3 mb-4">
                                {currentQuestion ? (
                                    ["option_a", "option_b", "option_c", "option_d"].map((optKey, idx) => {
                                        const label = ["A", "B", "C", "D"][idx];
                                        const text = (currentQuestion as any)[optKey];
                                        // const checked = true;
                                        return (
                                            <label key={optKey} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`answer-${currentQuestion.assessment_question_id}`}
                                                    checked={answer[current] === label}
                                                    onChange={() => handleAnswer(label)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="text-sm">{label}. {text}</span>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <div className="text-sm text-gray-500">Memuat jawaban...</div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                {
                                    current < questions.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!answer[current]}
                                            className={`px-4 py-2 rounded shadow-sm active:scale-95 ${answer[current] ? 'bg-gray-100 cursor-pointer hover:bg-gray-300' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
                                        >
                                            Berikutnya
                                        </button>
                                    ) : (<SubmitDialog disabled={!answer[current]} onConfirm={handleSubmit} />)
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import { ParsedQuestion } from "@/app/dashboard/list-skill-assessment/types/questionAssessment";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SkillAssessmentPage() {
    const user = useAuthStore();
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? "";
    // contoh data
    // const total = 50;
    const [current, setCurrent] = useState(0);
    // const [answers, setAnswers] = useState<Record<number, string | null>>({});
    const [timeLeft, setTimeLeft] = useState(90 * 60); // detik (90 menit)
    const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);

    const fetchData = async () => {
        const { data } = await apiCall.get(`/questions/${slug[0]}`);
        setQuestions(data.data);
    }

    useEffect(() => {
        const t = setInterval(() => {
            setTimeLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        fetchData();
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        console.log(questions)
    }, [questions])

    const formatTime = (s: number) => {
        const hh = Math.floor(s / 3600)
            .toString()
            .padStart(2, "0");
        const mm = Math.floor((s % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const ss = Math.floor(s % 60)
            .toString()
            .padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    };

    const handleAnswer = (opt: string) => {
        // setAnswers((a) => ({ ...a, [current]: opt }));
        setAnswer((a) => ({...a, [current]: opt}));
    };

    const handleNext = () => {
        setCurrent((c) => Math.min(questions.length, c + 1));
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
                    {/* <p className="text-sm text-gray-600">Mata Kuliah: <span className="font-semibold">Algoritma - UTS</span></p> */}
                    {/* <p className="text-lg font-semibold">Muhammad Kahfi Yulian Prakarsa</p> */}
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
                                {/* {["A. 3", "B. 4", "C. 5", "D. 22"].map((opt, idx) => {
                                    const key = ["A", "B", "C", "D"][idx];
                                    return (
                                        <label
                                            key={key}
                                            className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                checked={answers[current] === key}
                                                onChange={() => handleAnswer(key)}
                                                className="form-radio h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    );
                                })} */}
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
                                                    // checked={checked}
                                                    onChange={() => handleAnswer(optKey)}
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
                                    current < questions.length-1 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-gray-100 rounded shadow-sm cursor-pointer hover:bg-gray-300 active:scale-95"
                                        >
                                            Berikutnya
                                        </button>
                                    ) : (
                                        <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded shadow-sm cursor-pointer hover:bg-indigo-800 active:scale-95">Submit Ujian</button>
                                    )
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { useParams } from "next/navigation";
import { Dot } from "lucide-react";

type SelectionQuestion = {
    selection_question_id: number;
    question: string;
    option_A: string;
    option_B: string;
    option_C: string;
    option_D: string;
    correct_option: "A" | "B" | "C" | "D";
};

type SelectionTest = {
    selection_id: number;
    job_id: number;
    passingScore: number;
    selection_questions: SelectionQuestion[];
};

const SelectionPage = () => {
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectionTest, setSelectionTest] = useState<SelectionTest | null>(null);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState<number | null>(null);

    const params = useParams();
    const { slug } = params;

    useEffect(() => {
        const getSoal = async () => {
            try {
                setLoading(true);
                const { data } = await apiCall.get(`/preselection/detail/crate-new-job-datascience-internship`);
                setSelectionTest(data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getSoal();
    }, [slug]);

    if (loading) {
        return <p className="text-center mt-20 text-lg font-medium">Loading soal...</p>;
    }

    if (!selectionTest) {
        return <p className="text-center mt-20 text-lg font-medium">Soal tidak ditemukan.</p>;
    }

    const question = selectionTest.selection_questions[current];
    const options = [
        { label: question.option_A, key: "A" },
        { label: question.option_B, key: "B" },
        { label: question.option_C, key: "C" },
        { label: question.option_D, key: "D" },
    ];

    const handleAnswer = (value: string) => {
        setAnswers((prev) => ({ ...prev, [question.selection_question_id]: value }));
    };

    const handleSubmit = async () => {
        // Hitung skor di frontend
        let totalCorrect = 0;
        selectionTest.selection_questions.forEach((q) => {
            const answer = answers[q.selection_question_id];
            if (answer) {
                const selectedKey = Object.keys({ A: q.option_A, B: q.option_B, C: q.option_C, D: q.option_D }).find(
                    (k) => (q as any)[`option_${k}`] === answer
                );
                if (selectedKey === q.correct_option) {
                    totalCorrect++;
                }
            }
        });

        const finalScore = Math.round((totalCorrect / selectionTest.selection_questions.length) * 100);
        setScore(finalScore);

        try {
            const payload = selectionTest.selection_questions.map((q) => ({
                selection_question_id: q.selection_question_id,
                answer: answers[q.selection_question_id] || "",
            }));

            console.log({
                selection_id: selectionTest.selection_id,
                answers: payload,
                score: finalScore,
            })

            const { data } = await apiCall.post("/preselection/submit", {
                selection_id: selectionTest.selection_id,
                score: finalScore,
            });
            if (data.success) {
                alert(`Tes selesai! Skor Anda: ${finalScore}%`);
            }
        } catch (error) {
            console.log(error);
            alert("Terjadi kesalahan saat mengirim jawaban.");
        }
    };

    const progress = ((current + 1) / selectionTest.selection_questions.length) * 100;

    if (!started) {
        return (
            <div className="max-w-4xl mx-auto p-10">
                <Card className="shadow-2xl rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">
                            Pre Selection Test
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 text-gray-700 text-lg">
                        <p className="text-xl">
                            Sebelum melanjutkan ke tahap lamaran kerja, Anda diminta untuk menyelesaikan tes seleksi awal ini.
                        </p>
                        <ul className="list-disc list-inside space-y-3 text-base">
                            <li>Tes berisi {selectionTest.selection_questions.length} pertanyaan pilihan ganda.</li>
                            <li>Soal-soal berhubungan dengan posisi yang Anda lamar.</li>
                            <li>Jawaban yang benar akan membantu perusahaan menilai kompetensi Anda.</li>
                            <li>Setelah tes selesai, hasil akan langsung tersimpan dan ditampilkan pada daftar pelamar.</li>
                        </ul>
                        <div className="flex justify-end">
                            <Button size="lg" className="px-8 py-4 text-lg" onClick={() => setStarted(true)}>
                                Mulai Tes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-10">
            <Card className="shadow-2xl rounded-3xl">
                <CardHeader className="space-y-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-semibold">
                            Soal {current + 1} dari {selectionTest.selection_questions.length}
                        </CardTitle>
                        <span className="text-lg text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-300 rounded-full">
                        <div
                            className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <p className="font-semibold text-gray-800 text-xl">{question.question}</p>

                    <RadioGroup
                        value={answers[question.selection_question_id] || ""}
                        onValueChange={handleAnswer}
                        className="space-y-4"
                    >
                        {options.map((opt, i) => (
                            <div
                                key={i}
                                className={`flex items-center space-x-4 p-5 border-2 rounded-2xl transition cursor-pointer text-lg ${answers[question.selection_question_id] === opt.label ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => handleAnswer(opt.label)}
                            >
                                <span className="font-bold w-6 h-6 flex items-center justify-center border-gray-400 text-gray-700">
                                    {opt.key} <Dot className="w-10 h-10" />
                                </span>
                                <RadioGroupItem
                                    value={opt.label}
                                    id={`q${question.selection_question_id}-${i}`}
                                    className="hidden"
                                />
                                <Label htmlFor={`q${question.selection_question_id}-${i}`} className="cursor-pointer w-full text-lg">
                                    {opt.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="flex justify-between pt-8">
                        <Button
                            variant="outline"
                            className="px-6 py-3 text-lg"
                            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
                            disabled={current === 0}
                        >
                            Sebelumnya
                        </Button>
                        {current === selectionTest.selection_questions.length - 1 ? (
                            <Button className="px-6 py-3 text-lg" onClick={handleSubmit}>
                                Submit
                            </Button>
                        ) : (
                            <Button
                                className="px-6 py-3 text-lg"
                                onClick={() =>
                                    setCurrent((c) => Math.min(c + 1, selectionTest.selection_questions.length - 1))
                                }
                            >
                                Selanjutnya
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SelectionPage;

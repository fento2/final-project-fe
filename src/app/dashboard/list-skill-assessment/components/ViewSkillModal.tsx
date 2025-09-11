"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { SkillAssessment } from "@/types/skillAssessment";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import TableQuestionPreview from "./TableQuestionsPreview";
import { QuestionRow } from "../types/questionAssessment";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: SkillAssessment | null;
}

export default function ViewSkillModal({ isOpen, onClose, item }: Props) {
    const [serverError, setServerError] = useState("");
    const [questions, setQuestions] = useState<QuestionRow[]>([]);
    const [originalQuestions, setOriginalQuestions] = useState<QuestionRow[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [replaceAll, setReplaceAll] = useState<boolean>(false);
    const assessmentId = item?.assessment_id;

    const resetState = () => {
        setQuestions([]);
        setFileName("");
        setServerError("");
        setReplaceAll(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const existingIds = originalQuestions.map(q => q.assessment_question_id);
            const parsedQuestions: QuestionRow[] = (jsonData as any[]).map((val, idx) => {
                const q: QuestionRow = {
                    assessment_question_id: existingIds[idx],
                    question: val["Question"] || val["question"] || "",
                    option_a: val["Option_A"] || val["option_a"] || "",
                    option_b: val["Option_B"] || val["option_b"] || "",
                    option_c: val["Option_C"] || val["option_c"] || "",
                    option_d: val["Option_D"] || val["option_d"] || "",
                    correct_option: (val["correct_option"] || val["Correct_Option"] || val["Answer"] || val["answer"] || "").toString().toUpperCase(),
                };
                return q;
            });

            setQuestions(parsedQuestions);
        };
        reader.readAsArrayBuffer(file);
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setServerError("");
            const res = await apiCall.get(`/questions/${assessmentId}`);
            const body = res.data;
            const list = Array.isArray(body) ? body : body?.data;
            const parsed: QuestionRow[] = (list as any[]).map((q: any, idx: number) => ({
                assessment_question_id: q.assessment_question_id ?? idx + 1,
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                correct_option: q.correct_option,
            }));
            setQuestions(parsed);
            setOriginalQuestions(parsed);
        } catch (err: any) {
            setServerError(err.message || "Error mengambil questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen || !item) return;
        resetState();
        if (!assessmentId) return;
        fetchQuestions();
    }, [isOpen, item]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        try {
            setServerError("");

            if (replaceAll) {
                await apiCall.delete(`/questions/${assessmentId}`);
                await apiCall.post(`/questions/${assessmentId}`, questions.map(q => {
                    const { assessment_question_id, ...data } = q;
                    return data;
                }))
            } else {
                const hasAnyId = questions.some(q => q.assessment_question_id);
                if (hasAnyId) {
                    await apiCall.put(`/questions/${assessmentId}`, questions);
                } else {
                    await apiCall.post(`/questions/${assessmentId}`, questions);
                }
            }

            await fetchQuestions();
            setFileName("");
        } catch (error: any) {
            setServerError(error?.response?.data?.message || "Gagal menyimpan questions");
        }
    }

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-lg p-6 shadow-lg grid gap-3">
                <div className="grid gap-1">
                    <Label>Skill Name</Label>
                    <Input type="text" disabled defaultValue={item?.skill_name} />
                </div>

                <div className="grid gap-1">
                    <Label>Questions Input</Label>
                    <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                    <Label className="text-xs text-muted-foreground opacity-75">
                        Upload the test questions in Excel format (.xlsx or .xls)
                    </Label>
                    {originalQuestions.length > 0 && (
                        <label className="flex items-center gap-2 text-xs mt-1 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={replaceAll}
                                onChange={(e) => setReplaceAll(e.target.checked)}
                            />
                            <span>Replace all existing questions (delete then insert)</span>
                        </label>
                    )}
                    {fileName && (
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span>File: {fileName}</span>
                            <Button type="button" variant="outline" className="h-6 px-2 text-xs"
                                onClick={() => {
                                    setFileName("");
                                    setQuestions(originalQuestions);
                                }}
                            >
                                Cancel Upload
                            </Button>
                        </div>
                    )}
                </div>

                {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}
                {loading && <p className="text-sm text-gray-500">Memuat data questions...</p>}
                {!loading && questions.length === 0 && <p className="text-sm text-gray-500 italic">Belum ada question. Upload file untuk menambahkan.</p>}

                {questions.length > 0 && (
                    <div className="grid gap-3">
                        <h3 className="text-sm font-semibold">
                            {fileName ? `Preview Questions (${questions.length})` : `Questions from DB (${questions.length})`}
                        </h3>
                        <TableQuestionPreview questions={questions} />
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!fileName && questions === originalQuestions}>
                        {replaceAll ? "Replace" : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
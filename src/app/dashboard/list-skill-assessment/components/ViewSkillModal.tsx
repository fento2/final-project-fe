"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillAssessment } from "@/types/skillAssessment";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: SkillAssessment | null;
}

interface ParsedQuestion {
    id?: string | number;
    question: string;
    option_a?: string;
    option_b?: string;
    option_c?: string;
    option_d?: string;
    answer?: string;
    [key: string]: any;
}

export default function ViewSkillModal({ isOpen, onClose, item }: Props) {
    const [serverError, setServerError] = useState("");
    const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
    const [fileName, setFileName] = useState<string>("");

    const resetState = () => {
        setQuestions([]);
        setFileName("");
        setServerError("");
    };

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerError("");
        const file = e.target.files?.[0];
        if (!file) {
            resetState();
            return;
        }
        setFileName(file.name);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            // Normalisasi keys (lowercase + trim)
            const normalized = json.map((row, idx) => {
                const obj: ParsedQuestion = { id: idx + 1, question: "" };
                Object.keys(row).forEach(k => {
                    const nk = k.toString().trim().toLowerCase();
                    obj[nk] = row[k];
                });
                // Fallback jika kolom 'question' berbeda nama (misal 'soal')
                if (!obj.question) {
                    obj.question = obj["soal"] || obj["pertanyaan"] || "";
                }
                return obj;
            }).filter(r => r.question?.toString().trim() !== "");

            setQuestions(normalized);
        } catch (err: any) {
            console.error(err);
            setServerError("Gagal membaca file. Pastikan format XLSX benar.");
            resetState();
        }
    }, []);

    const handleSubmit = async () => {
        try {

        } catch (error: any) {
            setServerError(error.response.data.message)
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
                    <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                    {fileName && (
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span>File: {fileName}</span>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                    resetState();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    )}
                </div>

                {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}

                {questions.length > 0 && (
                    <div className="grid gap-3">
                        <h3 className="text-sm font-semibold">Preview Questions ({questions.length})</h3>
                        <div className="relative rounded-md border overflow-x-auto max-h-[50vh] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr className="text-left">
                                        <th className="p-2 w-10">#</th>
                                        <th className="p-2">Question</th>
                                        <th className="p-2">A</th>
                                        <th className="p-2">B</th>
                                        <th className="p-2">C</th>
                                        <th className="p-2">D</th>
                                        <th className="p-2">Answer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((q, i) => (
                                        <tr key={i} className="border-t hover:bg-gray-50">
                                            <td className="p-2 text-xs text-gray-500">{i + 1}</td>
                                            <td className="p-2">{q.question}</td>
                                            <td className="p-2">{q.option_a}</td>
                                            <td className="p-2">{q.option_b}</td>
                                            <td className="p-2">{q.option_c}</td>
                                            <td className="p-2">{q.option_d}</td>
                                            <td className="p-2 font-medium">{q.answer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Submit</Button>
                </div>
            </form>
        </div>
    )
}
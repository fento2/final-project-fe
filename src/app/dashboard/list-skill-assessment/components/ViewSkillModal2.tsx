"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { SkillAssessment } from "@/types/skillAssessment";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import TableQuestionPreview from "./TableQuestionsPreview";
import { FormSchema, FormValues, QuestionRow } from "../types/questionAssessment";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: SkillAssessment;
}

export default function ViewSkillModal2({ isOpen, item, onClose }: Props) {
    const [questions, setQuestions] = useState<QuestionRow[]>([]);
    const [parsedPreview, setParsedPreview] = useState<QuestionRow[]>([]);

    const {
        control,
        reset,
        watch,
        setError,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: { file: undefined as unknown as File | undefined },
        mode: "onChange", // penting biar validasi jalan saat input berubah
    });

    const watchedFile = watch("file");

    // parsing hanya jalan kalau file valid
    useEffect(() => {
        if (!watchedFile || !isValid) {
            setParsedPreview([]);
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: QuestionRow[] = XLSX.utils.sheet_to_json(worksheet);

                const existingIds = questions.map((q) => q.assessment_question_id);
                const parsedQuestions: QuestionRow[] = jsonData.map((val, idx) => ({
                    assessment_question_id: existingIds[idx],
                    question: val["question"],
                    option_a: val["option_a"],
                    option_b: val["option_b"],
                    option_c: val["option_c"],
                    option_d: val["option_d"],
                    correct_option: val["correct_option"],
                }));

                setParsedPreview(parsedQuestions);
            } catch (err) {
                console.error(err);
                setError("file", {
                    type: "manual",
                    message: "Gagal parsing file Excel",
                });
            }
        };
        reader.readAsArrayBuffer(watchedFile);
    }, [watchedFile, isValid, questions, setError]);

    const fetchData = async () => {
        try {
            const { data } = await apiCall.get(`/questions/${item?.assessment_id}`);
            const list: QuestionRow[] = Array.isArray(data) ? data : data.data;
            const parsed: QuestionRow[] = list.map((q, idx: number) => ({
                assessment_question_id: q.assessment_question_id ?? idx + 1,
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                correct_option: q.correct_option,
            }));
            setQuestions(parsed);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        item?.assessment_id && fetchData();
    }, [isOpen, item]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <form className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-lg p-6 shadow-lg grid gap-3">
                {/* Skill Name */}
                <div className="grid gap-1">
                    <Label>Skill Name</Label>
                    <Input type="text" disabled defaultValue={item?.skill_name} />
                </div>

                {/* File Upload */}
                <div className="grid gap-1">
                    <Label>Questions Input</Label>
                    <div className="flex gap-2 items-center">
                        <Controller
                            name="file"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        if (file) {
                                            setValue("file", file, { shouldValidate: true });
                                        }
                                        field.onChange(file);
                                    }}
                                />
                            )}
                        />
                        <Button type="submit" hidden={parsedPreview.length === 0}>
                            Save
                        </Button>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {watchedFile ? `Selected file: ${watchedFile.name}` : "No file selected"}
                    </div>
                    {errors.file && (
                        <p className="text-sm text-red-500">{errors.file.message}</p>
                    )}
                </div>

                {/* Preview / DB Questions */}
                {parsedPreview.length > 0 ? (
                    <div className="grid gap-3">
                        <h3 className="text-sm font-semibold">
                            Preview Questions ({parsedPreview.length})
                        </h3>
                        <TableQuestionPreview questions={parsedPreview} />
                    </div>
                ) : (
                    <div className="grid gap-3">
                        <h3 className="text-sm font-semibold">
                            Questions from database ({questions.length})
                        </h3>
                        <TableQuestionPreview questions={questions} />
                    </div>
                )}
            </form>
        </div>
    );
}
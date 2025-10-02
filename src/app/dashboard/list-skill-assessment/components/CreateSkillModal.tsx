"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { skillSchema } from "@/validation/skill.validation";
import { SkillAssessment } from "@/types/skillAssessment";

type FormValues = z.infer<typeof skillSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (item: SkillAssessment) => void;
}

export default function CreateSkillModal({ isOpen, onClose, onCreated }: Props) {
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, reset, formState } = useForm<FormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: { skill_name: "" },
    });

    if (!isOpen) return null;

    const onSubmit = async (values: FormValues) => {
        setServerError("");
        try {
            const res = await apiCall.post("/skillAssessments", values);
            const created = res.data?.data || res.data || {
                assessment_id: Date.now(),
                skill_name: values.skill_name,
                createAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            onCreated?.(created);
            reset();
            onClose();
        } catch (err: any) {
            setServerError(err?.response?.data?.message || "Create failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Create Skill Assessment</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid gap-1">
                    <Label>Skill Name</Label>
                    <Input type="text" {...register("skill_name")} />
                    {
                        formState.errors.skill_name && (
                            <p className="text-sm text-red-500">
                                {formState.errors.skill_name.message}
                            </p>
                        )
                    }
                </div>

                {serverError && (
                    <p className="mt-2 text-sm text-red-500">{serverError}</p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        disabled={formState.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={formState.isSubmitting}
                    >
                        {formState.isSubmitting ? "Saving..." : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
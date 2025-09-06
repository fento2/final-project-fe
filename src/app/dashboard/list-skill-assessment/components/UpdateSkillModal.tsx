"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { SkillAssessment } from "@/types/skillAssessment";
import { skillSchema } from "@/validation/skill.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type FormValues = z.infer<typeof skillSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: SkillAssessment | null;
    onUpdated?: (item: SkillAssessment) => void;
}

export default function UpdateSkillModal({ isOpen, onClose, item, onUpdated }: Props) {
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, reset, formState } = useForm<FormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: { skill_name: item?.skill_name ?? "" },
    });

    useEffect(() => {
        if (item) reset({ skill_name: item.skill_name });
    }, [item, reset]);

    if (!isOpen || !item) return null;

    const onSubmit = async (values: FormValues) => {
        try {
            const res = await apiCall.put(`/skillAssessments/${item!.assessment_id}`, values);
            const updated: SkillAssessment =
                res.data?.data || res.data || {
                    ...item!,
                    skill_name: values.skill_name,
                    updatedAt: new Date().toISOString(),
                };
            onUpdated?.(updated);
            onClose();
        } catch (error: any) {
            setServerError(error?.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Update Skill Assessment</h3>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid gap-1">
                    <Label>Skill Name</Label>
                    <Input type="text" {...register("skill_name")} />
                    {formState.errors.skill_name && (
                        <p className="text-sm text-red-500">{formState.errors.skill_name.message}</p>
                    )}
                </div>

                {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}

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
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={formState.isSubmitting}
                    >
                        {formState.isSubmitting ? "Saving..." : "Update"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
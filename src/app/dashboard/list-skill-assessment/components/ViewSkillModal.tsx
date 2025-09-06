"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillAssessment } from "@/types/skillAssessment";
import { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: SkillAssessment | null;
}

export default function ViewSkillModal({ isOpen, onClose, item }: Props) {
    const [serverError, setServerError] = useState("");

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

            <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-lg grid gap-3">
                <div className="grid gap-1">
                    <Label>Skill Name</Label>
                    <Input type="text" disabled defaultValue={item?.skill_name} />
                </div>

                <div className="grid gap-1">
                    <Label>Questions Input</Label>
                    <Input type="file" />
                </div>

                {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Submit</Button>
                </div>
            </form>
        </div>
    )
}
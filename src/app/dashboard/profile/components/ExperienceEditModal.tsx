"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import { toDateStartTimestamp } from "@/lib/formatDate";

const EditSchema = z.object({
    experience_id: z.number().optional(),
    name: z.string().min(1),
    position: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    description: z.string().optional(),
});

type EditForm = z.infer<typeof EditSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    experience?: Partial<EditForm> | null;
    onSaved?: () => void;
}

export default function ExperienceEditModal({ isOpen, onClose, experience, onSaved }: Props) {
    const { register, handleSubmit, reset, formState } = useForm<EditForm>({
        resolver: zodResolver(EditSchema),
        defaultValues: {
            experience_id: experience?.experience_id,
            name: experience?.name ?? "",
            position: experience?.position ?? "",
            startDate: experience?.startDate ?? "",
            endDate: experience?.endDate ?? "",
            description: experience?.description ?? "",
        },
    });

    const toInputDate = (val?: string | null) => {
        if (!val) return "";
        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        // reset form whenever experience changes / modal opens
        reset({
            experience_id: experience?.experience_id,
            name: experience?.name ?? "",
            position: experience?.position ?? "",
            // startDate: experience?.startDate ?? "",
            // endDate: experience?.endDate ?? "",
            startDate: toInputDate(experience?.startDate ?? null),
            endDate: toInputDate(experience?.endDate ?? null),
            description: experience?.description ?? "",
        });
    }, [experience, isOpen, reset]);

    const onSubmit = async (data: EditForm) => {
        try {
            if (!data.experience_id) {
                // fallback: create if no id (optional)
                await apiCall.post("/experiences", {
                    name: data.name,
                    position: data.position,
                    startDate: toDateStartTimestamp(data.startDate),
                    endDate: toDateStartTimestamp(data.endDate || "") ?? null,
                    description: data.description ?? null,
                });
            } else {
                await apiCall.put(`/experiences/${data.experience_id}`, {
                    name: data.name,
                    position: data.position,
                    startDate: toDateStartTimestamp(data.startDate),
                    endDate: toDateStartTimestamp(data.endDate || "") ?? null,
                    description: data.description ?? null,
                });
            }
            if (data.endDate) {
                alert(toDateStartTimestamp(data.endDate));
            }
            onSaved?.();
            onClose();
        } catch (err) {

        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Experience</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <div className="grid gap-1">
                        <Label>Company</Label>
                        <Input {...register("name")} />
                    </div>

                    <div className="grid gap-1">
                        <Label>Position</Label>
                        <Input {...register("position")} />
                    </div>

                    <div className="grid gap-1">
                        <Label>Start Date (ISO or text)</Label>
                        <Input type="date" {...register("startDate")} placeholder="e.g. 2020-01-01 or January 2020" />
                    </div>

                    <div className="grid gap-1">
                        <Label>End Date (ISO or text) — leave empty for Present</Label>
                        <Input type="date" {...register("endDate")} placeholder="e.g. 2021-08-31 or August 2021" />
                    </div>

                    <div className="grid gap-1">
                        <Label>Description</Label>
                        <Input {...register("description")} />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={!formState.isValid}>Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
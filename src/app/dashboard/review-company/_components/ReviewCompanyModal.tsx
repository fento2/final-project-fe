"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiCall } from "@/helper/apiCall";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RatingSelect from "./RatingSelectComponent";
import { UserCompanyItem } from "@/types/userCompany";

type Props = {
    isOpen: boolean;
    item: UserCompanyItem;
    onClose: () => void;
    onSaved?: () => void;
};

const FormValues = z.object({
    // user_company_id: z.number(),
    salary_estimate: z.number(),
    rating_culture: z.number().int().min(1).max(5),
    rating_work_life_balance: z.number().int().min(1).max(5),
    rating_facilities: z.number().int().min(1).max(5),
    rating_career: z.number().int().min(1).max(5),
    // comment: z.string(),
});

type FormValuesInfer = z.infer<typeof FormValues>;

export default function ReviewCompanyModal({ isOpen, item, onClose, onSaved }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    const { control, handleSubmit, reset } = useForm<FormValuesInfer>({
        resolver: zodResolver(FormValues),
        defaultValues: {
            salary_estimate: 0,
            rating_culture: 0,
            rating_work_life_balance: 0,
            rating_facilities: 0,
            rating_career: 0,
            // comment: "",
        },
    });

    useEffect(() => {
        setOpen(Boolean(isOpen));
        if (isOpen && item) {
            reset({
                salary_estimate: item.reviews?.salary_estimate || 0,
                rating_culture: item.reviews?.rating_culture || 1,
                rating_work_life_balance: item.reviews?.rating_work_life_balance || 1,
                rating_facilities: item.reviews?.rating_facilities || 1,
                rating_career: item.reviews?.rating_career || 1,
            })

        }
    }, [isOpen, reset, item]);

    if (!item) return null;

    const onSubmit = async (data: FormValuesInfer) => {
        if (!item) return;
        setSaving(true);
        try {
            // validate & transform using zod schema
            const parsed = FormValues.parse(data);
            const payload = {
                user_company_id: item.user_company_id,
                salary_estimate: parsed.salary_estimate,
                rating_culture: parsed.rating_culture,
                rating_work_life_balance: parsed.rating_work_life_balance,
                rating_facilities: parsed.rating_facilities,
                rating_career: parsed.rating_career,
                // comment: parsed.comment ?? undefined,
            };
            await apiCall.post("/reviewCompany", payload);
            onSaved?.();
            setOpen(false);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const onUpdate = async (data: FormValuesInfer) => {
        if (!item) return;
        setSaving(true);
        try {
            const parsed = FormValues.parse(data);
            const payload = {
                user_company_id: item.user_company_id,
                salary_estimate: parsed.salary_estimate,
                rating_culture: parsed.rating_culture,
                rating_work_life_balance: parsed.rating_work_life_balance,
                rating_facilities: parsed.rating_facilities,
                rating_career: parsed.rating_career,
            };
            await apiCall.patch(`/reviewCompany/${item.reviews?.review_id}`, payload);
            onSaved?.();
            setOpen(false);
            onClose();
        } catch (error) {

        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) onClose(); }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Review {item.company?.name}</DialogTitle>
                    <DialogDescription>Share your experience - provide a rating and optional comment.</DialogDescription>
                </DialogHeader>

                <form onSubmit={item.reviews ? handleSubmit(onUpdate) : handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div className="grid gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-2">Salary estimate (IDR)</label>
                            <Controller
                                control={control}
                                name="salary_estimate"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={field.value ?? 0}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        onKeyDown={(e) => {
                                            if (e.key.length === 1 && /\D/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const text = e.clipboardData.getData("text");
                                            if (/\D/.test(text)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const raw = String(e.target.value || "");
                                            const digits = raw.replace(/[^\d]/g, "");
                                            const num = digits === "" ? 0 : Number(digits);
                                            field.onChange(num);
                                        }}
                                        placeholder="e.g. 5000000"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <RatingSelect control={control} name="rating_culture" label="Culture" />
                            <RatingSelect control={control} name="rating_work_life_balance" label="Work-life balance" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <RatingSelect control={control} name="rating_facilities" label="Facilities" />
                            <RatingSelect control={control} name="rating_career" label="Career growth" />
                        </div>

                        {/* <div className="">
                            <label className="block text-sm font-medium mb-2">Comment</label>
                            <Controller
                                control={control}
                                name="comment"
                                render={({ field }) => (
                                    <Textarea {...field} rows={4} placeholder="Write a brief comment about your experience at this company" />
                                )}
                            />
                        </div> */}
                    </div>

                    <DialogFooter>
                        <div className="flex w-full justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => { setOpen(false); onClose(); }} disabled={saving}>Cancel</Button>
                            {
                                !item.reviews
                                    ? <Button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800">{saving ? "Saving..." : "Save"}</Button>
                                    : <Button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800">{saving ? "Updating..." : "Update"}</Button>
                            }
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
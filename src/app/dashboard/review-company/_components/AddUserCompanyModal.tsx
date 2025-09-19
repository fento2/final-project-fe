"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiCall } from "@/helper/apiCall";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/types/userCompany";

const Schema = z.object({
    company_id: z.number().optional().nullable(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof Schema>;

export default function AddUserCompanyModal({ isOpen, onClose, onSaved, item }: { isOpen: boolean; onClose: () => void; onSaved?: () => void; item: Company; }) {
    const { register, handleSubmit, control, reset, formState } = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            company_id: null,
            start_date: "",
            end_date: "",
        },
    });

    const [companies, setCompanies] = useState<Array<{ company_id: number; name: string }>>([]);

    useEffect(() => {
        if (isOpen) {
            reset({
                company_id: null,
                start_date: "",
                end_date: "",
            });
        }
    }, [isOpen, reset]);

    useEffect(() => {
        if (!isOpen) return;
        let mounted = true;
        (async () => {
            try {
                const res = await apiCall.get("/company");
                const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                const list = Array.isArray(raw) ? raw : raw.data ?? [];
                if (mounted) setCompanies(list);
            } catch (err) {
                console.error("fetch companies:", err);
            }
        })();
        return () => { mounted = false; };
    }, [isOpen]);

    const onSubmit = async (data: FormValues) => {
        try {
            const payload: FormValues = {
                start_date: data.start_date ?? new Date(data.start_date).toISOString(),
                end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
            };

            if (data.company_id && data.company_id !== null) {
                payload.company_id = Number(data.company_id);
            }

            console.log(payload);
            await apiCall.post("/user-companies", payload);
            onSaved?.();
            onClose();
        } catch (err: any) {
            console.error("Add user company failed:", err);
            alert(err?.response?.data?.message || "Gagal menambah riwayat kerja");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Riwayat Kerja</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <div className="grid gap-1">
                        <Label>Company (pilih dari daftar atau kosongkan untuk perusahaan baru)</Label>
                        <Controller
                            control={control}
                            name="company_id"
                            render={({ field }) => {
                                const selectValue = field.value === null || field.value === undefined ? "new" : String(field.value);
                                return (
                                    <Select value={selectValue} onValueChange={(val) => {
                                        if (val === "new") {
                                            field.onChange(null);
                                        } else {
                                            const num = Number(val);
                                            field.onChange(Number.isNaN(num) ? null : num);
                                        }
                                    }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="-- New company --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">-- New company --</SelectItem>
                                            {companies.map((c) => (
                                                <SelectItem key={c.company_id} value={String(c.company_id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                );
                            }}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label>Start Date</Label>
                        <Input className="w-full" type="date" {...register("start_date")} />
                    </div>

                    <div className="grid gap-1">
                        <Label>End Date (opsional)</Label>
                        <Input type="date" {...register("end_date")} />
                    </div>

                    <DialogFooter>
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={!formState.isValid}>Save</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Job {
    nameJob: string;
    nameCompany: string;
    status: "Current" | "Past";
    wage: string;
    periodStart: string;
    periodEnd: string;
}

interface WorkHistoryModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (job: Job) => void;
}

const initialForm: Job = {
    nameJob: "",
    nameCompany: "",
    status: "Current",
    wage: "",
    periodStart: "",
    periodEnd: "",
};

export function WorkHistoryModal({ open, onClose, onAdd }: WorkHistoryModalProps) {
    const [form, setForm] = useState<Job>(initialForm);

    // reset saat dibuka
    useEffect(() => {
        if (open) setForm(initialForm);
    }, [open]);

    function handleChange<K extends keyof Job>(key: K, value: Job[K]) {
        setForm((s) => ({ ...s, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newJob: Job = {
            nameJob: form.nameJob.trim() || "Untitled",
            nameCompany: form.nameCompany.trim() || "Unknown",
            status: form.status,
            wage: form.wage || "-",
            periodStart: form.periodStart,
            periodEnd: form.periodEnd,
        };
        onAdd(newJob);
        onClose();
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-history-modal-title"
        >
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 id="work-history-modal-title" className="text-lg font-medium">
                        Add new job
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <X />
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label className="mb-1 block">Job Name</Label>
                        <Input
                            value={form.nameJob}
                            onChange={(e) => handleChange("nameJob", e.target.value)}
                            placeholder="Job name"
                            // className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block">Company Name</Label>
                        <Input
                            value={form.nameCompany}
                            onChange={(e) => handleChange("nameCompany", e.target.value)}
                            placeholder="Company"
                            // className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block">Status</Label>
                        <Select
                            value={form.status}
                            // onChange={(e) => handleChange("status", e.target.value as Job["status"])}
                            onValueChange={(val) => handleChange("status", val as Job["status"])}
                            // className="w-full border rounded px-3 py-2"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Current">Current</SelectItem>
                                <SelectItem value="Past">Past</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="mb-1 block">Wage</Label>
                        <Input
                            type="number"
                            inputMode="decimal"
                            value={form.wage}
                            onChange={(e) => handleChange("wage", e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key.length === 1 && !/[0-9.]/.test(e.key)) e.preventDefault();
                            }}
                            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                            placeholder="Wages"
                        // className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div className="w-full">
                        <Label className="mb-1 block">Start Work</Label>
                        <input
                            type="date"
                            value={form.periodStart}
                            onChange={(e) => handleChange("periodStart", e.target.value)}
                            className="w-full border rounded-md px-3 py-1"
                            required
                        />
                    </div>

                    <div>
                        <Label className="mb-1 block">End Work (optional)</Label>
                        <input
                            type="date"
                            value={form.periodEnd}
                            onChange={(e) => handleChange("periodEnd", e.target.value)}
                            className="w-full border rounded-md px-3 py-1"
                            min={form.periodStart || undefined}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        // className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Add job
                    </Button>
                </div>
            </form>
        </div>
    );
}
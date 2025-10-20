"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CompanyAutocomplete from "./FormCompanyComplete";
import { toDateString } from "@/lib/formatDate";
import z, { success } from "zod";
import { apiCall } from "@/helper/apiCall";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const ExperienceSchema = z.object({
    experience_id: z.number().optional(),
    name: z.string().min(1),
    position: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable(),
    description: z.string(),
    user_id: z.number().optional(),
});

type ExperienceValue = z.infer<typeof ExperienceSchema>;

const ExperienceForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [isCurrent, setIsCurrent] = useState(false);

    const [form, setForm] = useState({
        company: "",
        position: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
    });

    // Sinkronisasi state modal dengan query
    useEffect(() => {
        if (searchParams.get("experience") === "create") {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [searchParams]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const startDate = toDateString(form.startMonth, form.startYear, false);
        if (!startDate) {
            alert("Invalid start date");
            return;
        }
        const endDate = form.endMonth && form.endYear ? toDateString(form.endMonth, form.endYear, true) : null;
        const payload: ExperienceValue = {
            name: form.company,
            position: form.position,
            startDate: startDate,
            endDate: endDate || null,
            description: form.description,
        }

        const result = await apiCall.post("/experiences", payload);
        alert(result.status);
        setOpen(false);
        router.replace("/dashboard/profile");
    };

    // Saat modal dibuka/ditutup
    const handleOpenChange = (value: boolean) => {
        setOpen(value);
        if (value) {
            router.replace("/dashboard/profile?experience=create");
        } else {
            router.replace("/dashboard/profile");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default"><Plus /> Add Experience</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Company */}
                    <div className="space-y-1">
                        <Label htmlFor="company">Company</Label>
                        <CompanyAutocomplete
                            value={form.company}
                            onChange={(val) => setForm(prev => ({ ...prev, company: val }))}
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-1">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            name="position"
                            placeholder="e.g. Software Engineer"
                            value={form.position}
                            onChange={handleChange}
                            className="py-6 !text-lg"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <Label>Start Date</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={(val) => handleSelect("startMonth", val)}>
                                <SelectTrigger className="w-1/2 py-6 text-lg">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m, i) => (
                                        <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(val) => handleSelect("startYear", val)}>
                                <SelectTrigger className="w-1/2 py-6 text-lg">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <Label>End Date</Label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="endDate"
                                checked={isCurrent}
                                onChange={(e) => {
                                    const checked = e.target.checked
                                    setIsCurrent(checked);
                                    if (isCurrent) {
                                        setForm(prev => ({ ...prev, endMonth: "", endYear: "" }));
                                    }
                                }}
                            />
                            Current
                        </label>
                        {
                            !isCurrent && (
                                <div className="flex gap-2">
                                    <Select onValueChange={(val) => handleSelect("endMonth", val)}>
                                        <SelectTrigger className="w-1/2 py-6 text-lg">
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((m, i) => (
                                                <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(val) => handleSelect("endYear", val)}>
                                        <SelectTrigger className="w-1/2 py-6 text-lg">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((y) => (
                                                <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your role, responsibilities, and achievements..."
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="!text-lg"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-500">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceForm;
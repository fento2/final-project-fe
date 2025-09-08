"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { GraduationCap, Plus } from "lucide-react";
import UniversityAutocomplete from "./FormUnivAutoComplete";
import { useRouter, useSearchParams } from "next/navigation";
import { months, years } from "@/helper/profileHelper";

const EducationForm = () => {
    const [form, setForm] = useState({
        university: "",
        degree: "",
        fieldOfStudy: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
    });
    const searchParams = useSearchParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    // Sync open state dengan query
    useEffect(() => {
        if (searchParams.get("education") === "create") {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [searchParams]);
    // Update query saat klik tombol Add
    const handleAddClick = () => {
        router.replace("/dashboard/profile?education=create");
    };
    // Hapus query saat modal ditutup
    const handleOpenChange = (value: boolean) => {
        setOpen(value);
        if (value) {
            router.replace("/dashboard/profile?education=create");
        } else {
            router.replace("/dashboard/profile");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === "university" && value.length > 0) {
        }
    };
    const handleSelect = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(form);
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={handleAddClick}>
                    <Plus /> Add Education
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap /> Add Education
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 relative">
                    <div className="space-y-1">
                        <Label htmlFor="university">University</Label>
                        <UniversityAutocomplete
                            value={form.university}
                            onChange={(val) => setForm(prev => ({ ...prev, university: val }))}
                        />
                    </div>
                    {/* Degree */}
                    <div className="space-y-1">
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                            id="degree"
                            name="degree"
                            placeholder="e.g. Bachelor's"
                            value={form.degree}
                            onChange={handleChange}
                            className="py-6 !text-lg placeholder:text-gray-400"
                        />
                    </div>

                    {/* Field of Study */}
                    <div className="space-y-1">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                            id="fieldOfStudy"
                            name="fieldOfStudy"
                            placeholder="e.g. Computer Science"
                            value={form.fieldOfStudy}
                            onChange={handleChange}
                            className="py-6 !text-lg placeholder:text-gray-400"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <Label>Start Date</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={(val) => handleSelect("startMonth", val)}>
                                <SelectTrigger className="w-1/2 text-lg py-6">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m, i) => <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(val) => handleSelect("startYear", val)}>
                                <SelectTrigger className="w-1/2 text-lg py-6">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <Label>End Date</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={(val) => handleSelect("endMonth", val)}>
                                <SelectTrigger className="w-1/2 text-lg py-6">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m, i) => <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(val) => handleSelect("endYear", val)}>
                                <SelectTrigger className="w-1/2 text-lg py-6">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your activities, achievements, or focus..."
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="!text-lg placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="bg-indigo-500 w-full">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EducationForm;

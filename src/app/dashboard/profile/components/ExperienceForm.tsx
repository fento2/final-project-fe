"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import CompanyAutocomplete from "./FormCompanyComplete";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const ExperienceForm = () => {
    const [form, setForm] = useState({
        company: "",
        position: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <Dialog>
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
                                        <SelectItem key={i} value={m}
                                            className="p-4 text-lg">{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(val) => handleSelect("startYear", val)}>
                                <SelectTrigger className="w-1/2 py-6 text-lg">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}
                                            className="p-4 text-lg">{y}</SelectItem>
                                    ))}
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
                                    {months.map((m, i) => (
                                        <SelectItem key={i} value={m}
                                            className="text-lg p-4">{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(val) => handleSelect("endYear", val)}>
                                <SelectTrigger className="w-1/2 text-lg py-6">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}
                                            className="text-lg p-4">{y}</SelectItem>
                                    ))}
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
                            placeholder="Describe your role, responsibilities, and achievements..."
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="!text-lg"
                        />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full bg-indigo-500">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceForm;

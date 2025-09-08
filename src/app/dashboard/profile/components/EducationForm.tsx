"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { createEducationFetch, getEducationDetailFetch } from "@/fetch/profile.fetch";
import { useToast } from "@/components/basic-toast";
import { Dots_v2 } from "@/components/ui/spinner";
import { useEducationStore } from "@/lib/zustand/educationStorage";
import DateForm from "./DateForm";

const EducationForm = () => {
    const {
        university,
        degree,
        fieldOfStudy,
        startMonth,
        startYear,
        endMonth,
        endYear,
        description,
        setField,
        reset
    } = useEducationStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // Sync open state dengan query
    useEffect(() => {
        if (searchParams.get("education") === "create") {
            setOpen(true);
        } else if (searchParams.get('education') === 'edit') {
            handleGetDetailEducation()
            setOpen(true)
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
            reset(); // reset store
        }
    };

    const handleGetDetailEducation = async () => {
        const education_id = searchParams.get('id')
        await getEducationDetailFetch(education_id || '', setField)
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createEducationFetch(toast, {
            university,
            degree,
            fieldOfStudy,
            startMonth,
            startYear,
            endMonth,
            endYear,
            description
        }, setLoading, reset);
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
                    {loading && <div className="absolute z-50 flex justify-center h-screen w-full">
                        <Dots_v2 />
                    </div>}

                    {/* University */}
                    <div className="space-y-1">
                        <Label htmlFor="university">University</Label>
                        <UniversityAutocomplete
                            value={university}
                            onChange={(val) => setField("university", val)}
                        />
                    </div>

                    {/* Degree */}
                    <div className="space-y-1">
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                            id="degree"
                            name="degree"
                            placeholder="e.g. Bachelor's"
                            value={degree}
                            onChange={(e) => setField("degree", e.target.value)}
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
                            value={fieldOfStudy}
                            onChange={(e) => setField("fieldOfStudy", e.target.value)}
                            className="py-6 !text-lg placeholder:text-gray-400"
                        />
                    </div>
                    <DateForm startMonth={startMonth} startYear={startYear} endMonth={endMonth} endYear={endYear} setField={setField} />
                    {/* Description */}
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your activities, achievements, or focus..."
                            rows={4}
                            value={description}
                            onChange={(e) => setField("description", e.target.value)}
                            className="!text-lg placeholder:text-gray-400"
                        />
                    </div>

                    <Button type="submit" className="bg-indigo-500 w-full">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EducationForm;

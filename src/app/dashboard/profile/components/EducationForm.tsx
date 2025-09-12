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
import { useToast } from "@/components/basic-toast";
import { useEducationStore } from "@/lib/zustand/educationStorage";
import DateForm from "./DateForm";
import {
    createEducationFetch,
    editEducationFetch,
    getEducationDetailFetch,
} from "@/fetch/educationFetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toTitleCase } from "@/helper/toTitleCase";
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
        reset,
    } = useEducationStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();
    const [open, setOpen] = useState(false);

    // Sinkronisasi modal dengan query
    useEffect(() => {
        const type = searchParams.get("education");
        const id = searchParams.get("id");
        if (type === "create") {
            setOpen(true);
        } else if (type === "edit" && id) {
            setOpen(true);
            getEducationDetailFetch(id, setField as any);
        } else {
            setOpen(false);
        }
    }, [searchParams, setField]);
    // Buka form create
    const handleAddClick = () => {
        router.replace("/dashboard/profile?education=create");
    };
    // Tutup form
    const handleClose = () => {
        router.replace("/dashboard/profile");
        reset();
        setOpen(false);
    };
    // Create
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createEducationFetch(
            toast,
            {
                university,
                degree,
                fieldOfStudy,
                startMonth,
                startYear,
                endMonth,
                endYear,
                description,
            },
            reset,
            setOpen
        );
        if (result) {
            handleClose();
        }
    };
    // Edit
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        const education_id = searchParams.get("id") || "";
        const result = await editEducationFetch(
            toast,
            {
                university,
                degree,
                fieldOfStudy,
                startMonth,
                startYear,
                endMonth,
                endYear,
                description,
            },
            reset,
            education_id,
            setOpen
        );
        if (result) {
            handleClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={handleAddClick}>
                    <Plus /> Add Education
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap />{" "}
                        {searchParams.get("education") === "edit"
                            ? "Edit Education"
                            : "Add Education"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) =>
                        searchParams.get("education") === "edit" ? handleEdit(e) : handleSubmit(e)
                    }
                    className="space-y-4 relative"
                >
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
                        <Select
                            value={degree}
                            onValueChange={(val) => setField("degree", val)}
                        >
                            <SelectTrigger id="degree" className="py-6 !text-lg w-full">
                                <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                                {['HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'DOCTORATE'].map((v, idx) => (
                                    <SelectItem key={idx} value={v} className="p-4 text-lg">{toTitleCase(v)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                    {/* Dates */}
                    <DateForm
                        startMonth={startMonth}
                        startYear={startYear}
                        endMonth={endMonth}
                        endYear={endYear}
                        setField={setField}
                    />
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
                    <Button type="submit" className="bg-indigo-500 w-full">
                        {searchParams.get("education") === "edit" ? "Save Edit" : "Post"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default EducationForm;

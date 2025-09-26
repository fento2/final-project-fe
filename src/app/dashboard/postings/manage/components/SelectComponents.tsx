'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getValue, setValue } from "@/helper/postingsHelper"
import { toTitleCase } from "@/helper/toTitleCase"
import { useCreateJobStore } from "@/lib/zustand/postingCreateStore"
import { useEditJobStore } from "@/lib/zustand/editJobStore"
import { useGeneralDataStore } from "@/lib/zustand/generalData"
import { usePathname } from "next/navigation"

export const FirstSectionForm = () => {
    const pathname = usePathname();
    const {
        title,
        category,
        job_type: jobType,
        setTitle,
        setCategory,
        setJobType,
    } = useCreateJobStore();
    const {
        editTitle,
        editCategory,
        editJobType,
        setEditTitle,
        setEditCategory,
        setEditJobType,
    } = useEditJobStore();
    const { categories, jobTypes } = useGeneralDataStore()

    return <>
        {/* Job Title */}
        <div className="md:col-span-2">
            <Label htmlFor="title" className="text-lg">
                Job Title
            </Label>
            <Input
                id="title"
                value={getValue(title, editTitle, pathname)}
                onChange={(e) =>
                    setValue(setTitle, setEditTitle, e.target.value, pathname)
                }
                placeholder="Job Title"
                className="py-6 !text-lg w-full"
            />
        </div>

        {/* Category */}
        <div className="md:col-span-2">
            <Label htmlFor="category" className="text-lg">
                Category
            </Label>
            <Select
                onValueChange={(val) =>
                    setValue(setCategory, setEditCategory, val, pathname)
                }
                value={getValue(category, editCategory, pathname)}
            >
                <SelectTrigger className="w-full p-6 text-lg">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat, idx) => (
                        <SelectItem
                            key={idx}
                            value={cat}
                            className="p-4 text-lg"
                        >
                            {toTitleCase(cat)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Job Type */}
        <div className="md:col-span-2">
            <Label htmlFor="jobType" className="text-lg">
                Job Type
            </Label>
            <Select
                onValueChange={(val) =>
                    setValue(setJobType, setEditJobType, val, pathname)
                }
                value={getValue(jobType, editJobType, pathname)}
            >
                <SelectTrigger className="w-full p-6 text-lg">
                    <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                    {jobTypes.map((type, idx) => (
                        <SelectItem
                            key={idx}
                            value={type}
                            className="p-4 text-lg"
                        >
                            {toTitleCase(type)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </>
}
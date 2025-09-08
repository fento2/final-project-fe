"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Calendar, GraduationCap, Dot, ArrowRight } from "lucide-react";
import { CardEducationProps, getEducationDetailFetch, getEducationListFetch } from "@/fetch/profile.fetch";
import { useEducationStore } from "@/lib/zustand/educationStorage";

// format date
const formatDateToMonthYear = (dateStr?: string) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

// Single card
const CardEducationItem = ({
    education_id,
    university,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    description,
    onEdit,
    onDelete,
}: CardEducationProps & { onEdit: () => void; onDelete: () => void }) => {
    return (
        <Card className="w-full shadow-xs hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                        {university}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>{degree}</span>
                        <Dot />
                        <span>{fieldOfStudy}</span>
                    </CardDescription>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100">
                        <div className="hover:bg-indigo-400 p-2 hover:rounded-full">
                            <EllipsisVertical size={20} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-2 flex flex-col gap-1">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDateToMonthYear(startDate)}
                    <ArrowRight className="w-4 h-4" />
                    {endDate ? formatDateToMonthYear(endDate) : "Present"}
                </p>
                {description && <p className="text-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
};

// List component
const CardEducationList = ({
    educations,
    onEdit,
    onDelete,
}: {
    educations: CardEducationProps[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="space-y-4">
            {educations.map((edu) => (
                <CardEducationItem
                    key={edu.education_id}
                    {...edu}
                    onEdit={() => onEdit(edu.education_id)}
                    onDelete={() => onDelete(edu.education_id)}
                />
            ))}
        </div>
    );
};

// Main component
const CardEducation = () => {
    const [educations, setEducations] = useState<CardEducationProps[]>([]);
    const router = useRouter();
    const { setField } = useEducationStore()

    const handleEdit = async (id: string) => {
        // push ke halaman edit dengan query id
        router.replace(`/dashboard/profile?education=edit&id=${id}`);

    };

    const handleDelete = (id: string) => {
        console.log("Delete education id:", id);
    };

    useEffect(() => {
        getEducationListFetch(setEducations);
    }, []);

    return (
        <CardEducationList
            educations={educations}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default CardEducation;

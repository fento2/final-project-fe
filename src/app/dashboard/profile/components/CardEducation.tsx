"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Calendar, GraduationCap } from "lucide-react";

interface CardEducationProps {
    university: string;
    degree: string;
    fieldOfStudy: string;
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
    description?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardEducation = ({
    university,
    degree,
    fieldOfStudy,
    startMonth,
    startYear,
    endMonth,
    endYear,
    description,
    onEdit,
    onDelete,
}: CardEducationProps) => {
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
                        <span>•</span>
                        <span>{fieldOfStudy}</span>
                    </CardDescription>
                </div>

                {/* Dropdown menu titik tiga */}
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
                <p className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4" /> {startMonth} {startYear} –{" "}
                    {endMonth && endYear ? `${endMonth} ${endYear}` : "Present"}
                </p>
                {description && <p className="text-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
};

export default CardEducation;

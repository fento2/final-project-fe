"use client";

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
import { Calendar, Briefcase, Dot, EllipsisVertical } from "lucide-react";

interface ExperienceCardProps {
    id: number;
    company: string;
    position: string;
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
    description?: string;
}

interface ExperienceCardListProps {
    experiences: ExperienceCardProps[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

// Single card component
const ExperienceCardItem = ({
    id,
    company,
    position,
    startMonth,
    startYear,
    endMonth,
    endYear,
    description,
    onEdit,
    onDelete,
}: ExperienceCardProps & { onEdit: () => void; onDelete: () => void }) => {
    return (
        <Card className="w-full shadow-xs hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        {company}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>{position}</span>
                    </CardDescription>
                </div>

                {/* Dropdown menu */}
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
                <p className="flex items-center gap-1 font-medium">
                    <Calendar className="w-4 h-4" />
                    {startMonth} {startYear}
                    <Dot className="w-2 h-2" />
                    {endMonth && endYear ? `${endMonth} ${endYear}` : "Present"}
                </p>
                {description && <p className="text-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
};

// List component dengan looping
const ExperienceCardList = ({
    experiences,
    onEdit,
    onDelete,
}: ExperienceCardListProps) => {
    return (
        <div className="space-y-4">
            {experiences.map((exp) => (
                <ExperienceCardItem
                    key={exp.id}
                    {...exp}
                    onEdit={() => onEdit(exp.id)}
                    onDelete={() => onDelete(exp.id)}
                />
            ))}
        </div>
    );
};

// Contoh dummy data sementara
const dummyExperiences: ExperienceCardProps[] = [
    {
        id: 1,
        company: "Google",
        position: "Software Engineer",
        startMonth: "January",
        startYear: "2020",
        endMonth: "March",
        endYear: "2023",
        description: "Worked on search algorithms and web services",
    },
    {
        id: 2,
        company: "Facebook",
        position: "Frontend Developer",
        startMonth: "April",
        startYear: "2018",
        endMonth: "December",
        endYear: "2019",
        description: "Built user interfaces and interactive dashboards",
    },
];

// Export default component yang langsung looping
const ExperienceCard = () => {
    const handleEdit = (id: number) => console.log("Edit", id);
    const handleDelete = (id: number) => console.log("Delete", id);

    return (
        <ExperienceCardList
            experiences={dummyExperiences}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default ExperienceCard;

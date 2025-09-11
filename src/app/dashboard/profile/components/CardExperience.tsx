"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiCall } from "@/helper/apiCall";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { Calendar, Briefcase, Dot, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import ExperienceEditModal from "./ExperienceEditModal";

interface ExperienceCardListProps {
    experiences: ExperienceValue[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

// Single card component
const ExperienceCardItem = ({ experience_id, name, position, user_id, startDate, endDate, description, onEdit, onDelete }: ExperienceValue & { onEdit: () => void; onDelete: () => void }) => {
    return (
        <Card className="w-full shadow-xs hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        {name}
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
                    {formatDateIDDateOnly(startDate || "")}
                    <Dot className="w-2 h-2" />
                    {/* {endMonth && endYear ? `${endMonth} ${endYear}` : "Present"} */}
                    {!endDate ? <Badge>Present</Badge> : formatDateIDDateOnly(endDate || "")}
                </p>
                {description && <p className="text-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
};

// List component dengan looping
const ExperienceCardList = ({ experiences, onEdit, onDelete }: ExperienceCardListProps) => {
    return (
        <div className="space-y-4">
            {experiences.map((exp) => (
                <ExperienceCardItem
                    key={exp.experience_id || 0}
                    {...exp}
                    onEdit={() => onEdit(exp.experience_id || 0)}
                    onDelete={() => onDelete(exp.experience_id || 0)}
                />
            ))}
        </div>
    );
};

const ExperienceSchema = z.object({
    experience_id: z.number().optional(),
    name: z.string().min(1),
    position: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string(),
    user_id: z.number().optional(),
});

type ExperienceValue = z.infer<typeof ExperienceSchema>;

// Export default component yang langsung looping
const ExperienceCard = () => {
    const [data, setData] = useState<ExperienceValue[]>([]);
    const [selected, setSelected] = useState<ExperienceValue | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const fetchData = async () => {
        try {
            const { data } = await apiCall.get("/experiences");
            setData(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleEdit = (id: number) => {
        const item = data.find(d => d.experience_id === id);
        if (!item) return;
        setSelected(item);
        setEditOpen(true);
    };
    const handleDelete = async (id: number) => {
        const result = await apiCall.delete(`/experiences/${id}`)
        if (result.status === 200) {
            alert("Deleted experience successfully");
            fetchData();
        }
    };

    return (
        <div>
            <ExperienceCardList
                experiences={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <ExperienceEditModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                experience={selected}
                onSaved={() => fetchData()}
            />
        </div>
    );
};

export default ExperienceCard;

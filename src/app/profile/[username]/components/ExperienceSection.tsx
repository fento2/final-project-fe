"use client";
import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { UserCompanyItem } from "@/types/userCompany";

type Experience = {
    experience_id?: number;
    name?: string;
    company?: string;
    position: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};

interface ExperienceSectionProps {
    experiences: Experience[];
    dataUserCompany: UserCompanyItem[];
}

export default function ExperienceSection({ experiences, dataUserCompany }: ExperienceSectionProps) {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
                <Briefcase className="w-5 h-5" /> Work Experience
            </h2>
            <div className="space-y-4">
                {experiences.length === 0 && (
                    <div className="text-sm text-gray-500">No experience records yet.</div>
                )}
                {experiences.map((exp) => (
                    <Card key={exp.experience_id} className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="font-semibold text-gray-900">{exp.position}</div>
                            <div className="text-sm text-gray-600">{exp.company || exp.name || "Company"}</div>
                            <div className="text-xs text-gray-500">
                                {exp.start_date || exp.startDate 
                                    ? formatDateIDDateOnly(exp.start_date || exp.startDate!) 
                                    : ""} - {
                                    (exp.end_date || exp.endDate) 
                                        ? formatDateIDDateOnly(exp.end_date || exp.endDate!) 
                                        : "Present"
                                }
                            </div>
                            {exp.description && (
                                <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {dataUserCompany && (
                    dataUserCompany.map((val) => (
                        <Card key={val.user_company_id} className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="font-semibold text-gray-900">{val.company.name}</div>
                                <div className="text-xs text-gray-500">
                                    {formatDateIDDateOnly(val.start_date)} - {
                                        val.end_date 
                                            ? formatDateIDDateOnly(val.end_date) 
                                            : "Present"
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </section>
    );
}
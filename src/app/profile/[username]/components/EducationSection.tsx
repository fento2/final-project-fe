"use client";
import { GraduationCap } from "lucide-react";
import { formatDateIDDateOnly } from "@/lib/formatDate";

type Education = {
    education_id: string;
    university?: string;
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    field_of_study?: string;
    startDate?: string;
    start_date?: string;
    endDate?: string | null;
    end_date?: string | null;
    description?: string;
};

interface EducationSectionProps {
    education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
                <GraduationCap className="w-5 h-5" /> Education
            </h2>
            <div className="space-y-4">
                {education.length === 0 && (
                    <div className="text-sm text-gray-500">No education records yet.</div>
                )}
                {education.map((edu) => (
                    <div key={edu.education_id} className="flex gap-3">
                        <div className="mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">
                                {edu.institution || edu.university || "Institution"}
                            </div>
                            <div className="text-sm text-gray-600">
                                {edu.field_of_study || edu.fieldOfStudy || "Field of Study"} 
                                {edu.degree && ` • ${edu.degree}`}
                            </div>
                            <div className="text-xs text-gray-500">
                                {edu.start_date || edu.startDate 
                                    ? formatDateIDDateOnly(edu.start_date || edu.startDate!) 
                                    : "Unknown"} - {
                                    (edu.end_date || edu.endDate) 
                                        ? formatDateIDDateOnly(edu.end_date || edu.endDate!) 
                                        : "Present"
                                }
                            </div>
                            {edu.description && (
                                <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
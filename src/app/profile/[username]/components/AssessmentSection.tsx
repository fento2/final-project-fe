"use client";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIDDateOnly } from "@/lib/formatDate";

interface Assessment {
    user_assessment_id: string;
    skill_name: string;
    score: number;
    date_taken: string;
    certificate_code: string | null;
}

interface AssessmentSectionProps {
    perfectAssessments: Assessment[];
}

export default function AssessmentSection({ perfectAssessments }: AssessmentSectionProps) {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600">
                <Award className="w-5 h-5" /> Skill Assessments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {perfectAssessments.length === 0 && (
                    <div className="col-span-full text-sm text-gray-500">No 100% score assessments yet.</div>
                )}
                {perfectAssessments.map((assessment) => (
                    <Card key={assessment.user_assessment_id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="mb-3">
                                    <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                    <div className="font-semibold text-gray-900 text-sm">
                                        {assessment.skill_name}
                                    </div>
                                </div>

                                <div className={`text-2xl font-bold mb-2 ${
                                    assessment.score >= 80 ? 'text-green-600' :
                                    assessment.score >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                    {assessment.score}%
                                </div>

                                {assessment.certificate_code && (
                                    <div className="mb-2">
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            Certified
                                        </span>
                                    </div>
                                )}

                                {assessment.date_taken && (
                                    <div className="text-xs text-gray-500 mb-1">
                                        {formatDateIDDateOnly(assessment.date_taken)}
                                    </div>
                                )}

                                {assessment.certificate_code && (
                                    <div className="text-xs text-gray-500 font-mono">
                                        {assessment.certificate_code}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
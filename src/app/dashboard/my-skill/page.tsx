"use client";
import { apiCall } from "@/helper/apiCall";
import formatDateID from "@/lib/formatDate";
import { UserAssessment } from "@/types/userAssessment";
import { Award, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MySkillPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<UserAssessment[]>([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await apiCall.get("/userAssessments");
            if (result.data) {
                setData(result.data.data);
            }
        } catch (error) {
            setError("Failed to load your skill assessments. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!data) return null;

    return (
        <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skills Assessments</h1>
            <p className="text-gray-600 mb-8">A collection of all the skill assessments you have completed.</p>
            {isLoading && <p className="text-gray-500">Loading your skills...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-wrap justify-center gap-3">
                {
                    data.length > 0 && data.map((item) => {
                        return (
                            <div key={item.user_assessment_id} className="bg-white border rounded-xl shadow-sm p-6 flex flex-col min-w-75">
                                <div className="flex-grow">
                                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                                        {item.assessment.skill_name}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{item.assessment.skill_name}</h3>
                                    <div className="grid grid-cols-3 items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 col-span-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.date_taken && formatDateID(item.date_taken.toString())}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4" />
                                            <strong>{item.score ?? "N/A"} / 100</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {item.assessment_certificates ? (
                                        <Link href={`/dashboard/my-skill/certificate/${item.assessment_certificates.certificate_code}`} rel="noopener noreferrer">
                                            <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
                                                <Award className="w-4 h-4" />
                                                View Certificate
                                            </button>
                                        </Link>
                                    ) : (
                                        <button className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed">
                                            Certificate Not Available
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
                {
                    data.length < 1 && !isLoading && (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-600">You don't have any skill assessments yet.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
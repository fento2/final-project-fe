"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { apiCall } from "@/helper/apiCall";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type skillAssessmentsSchema = {
    assessment_id: number,
    skill_name: string,
    createAt: string,
    updatedAt: string,
}

export default function SkillAssessmentDetailPage() {
    const router = useRouter();
    const param = useParams();
    const slug = Array.isArray(param.slug) ? param.slug[0] : param.slug ?? "";
    const [skillAssessments, setSkillAssessments] = useState<skillAssessmentsSchema[]>();

    const fetchData = async () => {
        const res = await apiCall.get(`/skillAssessments/${slug[0]}`);

        setSkillAssessments(res.data.data);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {

    }, [skillAssessments])

    const handleStart = async () => {
        if (!param.slug) return;
        if (confirm("Yakin ingin memulai tes?")) {
            const { data } = await apiCall.post("/userAssessments", { assessment_id: Number(slug[0]) });
            localStorage.setItem("takeAssessment", JSON.stringify(data.data));
            router.push(`/dashboard/skill-assessment/${param.slug}/take`);
        }
    };

    if (!skillAssessments) return;

    return (
        <div className="pl-20 p-4">
            <div className="grid justify-center">
                <Card className="min-w-3xl">
                    <CardContent>
                        {skillAssessments[0].skill_name}
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="link" className="cursor-pointer"><ArrowLeft /> Back</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleStart}>Start</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
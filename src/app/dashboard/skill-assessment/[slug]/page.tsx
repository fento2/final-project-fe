"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function SkillAssessmentDetailPage() {
    const router = useRouter();
    const param = useParams();

    const handleStart = () => {
        if (!param.slug) return;
        if (confirm("Yakin ingin memulai tes?")) {
            router.push(`/dashboard/skill-assessment/${param.slug}/take`);
        }
    };

    return (
        <div className="pl-20 p-4">
            <div className="grid justify-center">
                <Card className="min-w-3xl">
                    <CardContent>
                        {param.slug}
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="link"><ArrowLeft /> Back</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleStart}>Start</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft } from "lucide-react";

const dummyApplicant = {
    name: "John Doe",
    email: "john.doe@example.com",
    profile_picture: null,
    age: 28,
    gender: "Male",
    education: "Bachelor's Degree",
    expected_salary: 15000000,
    appliedOn: "2025-09-14T08:00:00Z",
    score: 85,
    jobTitle: "Frontend Developer",
    cvUrl: "/dummy-cv.pdf", // pastikan ada file PDF di public folder
    experience: [
        { company: "ABC Corp", role: "Frontend Developer", duration: "2 years" },
        { company: "XYZ Ltd", role: "Intern", duration: "6 months" }
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    certificates: ["React Certification", "Frontend Mastery"]
};

const DetailApplicationPage = () => {
    return (
        <div className="space-y-6 container mx-auto md:px-20 px-8 my-8 ">


        </div>
    );
};

export default DetailApplicationPage;

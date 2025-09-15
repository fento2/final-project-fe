"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "react-big-calendar";
import InterviewCalendar from "./BigCalender";
import { apiCall } from "@/helper/apiCall";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import ApplciantAction from "./ApplicantAction";

// Interfaces
interface Education {
    university: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Experience {
    name: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface Certificate {
    code: string;
}

interface DetailApplicant {
    name: string;
    email: string;
    score: number | null;
    profile_picture: string | null
    appliedOn: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    age?: number | null;
    gender?: string;
    expectedSalary: number;
    cvUrl?: string | null;
    education: Education[];
    experience: Experience[];
    CertificatesCode: Certificate[];
    jobTitle?: string;
    JobType?: string;
    jobCategory?: string;
}

// Dummy schedules, nanti diganti dari API
const existingSchedules: Event[] = [];

const DetailApplicationPage = () => {
    const [applicant, setApplicant] = useState<DetailApplicant | null>(null);
    const [status, setStatus] = useState<"In Review" | "Rejected" | "Interview Scheduled">(
        "In Review"
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    const searchParams = useSearchParams();
    const application_id = searchParams.get("id");

    const getDetail = async () => {
        if (!application_id) return;
        try {
            const { data } = await apiCall.get(`/applications/detail/${application_id}`);
            setApplicant(data.data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    if (!applicant) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-8 md:px-20 my-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">{applicant.name}</h1>
                <p className="text-xl text-muted-foreground font-medium mt-1">
                    {applicant.jobTitle ?? "-"} — Applied on {new Date(applicant.appliedOn).toLocaleDateString()}
                </p>
                <p className="text-lg text-muted-foreground font-medium">
                    Type: {applicant.JobType ?? "-"} | Category: {applicant.jobCategory ?? "-"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
                {/* Left Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        {/* Profile Card */}
                        <Card className="p-6 space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-32 h-32">
                                    {applicant.profile_picture ? (
                                        <AvatarImage
                                            src={applicant.profile_picture}
                                            alt={applicant.name}
                                            onError={(e) => {
                                                // Kalau gambar gagal load, ganti dengan fallback
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = "none";
                                            }}
                                        />
                                    ) : null}
                                    <AvatarFallback className="text-3xl">
                                        {applicant.name ? applicant.name[0] : "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <CardTitle className="text-2xl font-semibold">{applicant.name}</CardTitle>
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                    Score: {applicant.score ?? "-"}
                                </Badge>
                                <p className="text-lg text-muted-foreground">{applicant.email}</p>
                                <p className="text-lg text-muted-foreground">{applicant.phone ?? "-"}</p>
                                <p className="text-lg text-muted-foreground">{applicant.address ?? "-"}</p>
                                <p className="text-lg font-medium mt-2">
                                    Birthdate: {applicant.birthDate ? new Date(applicant.birthDate).toLocaleDateString() : "-"}
                                </p>
                                <p className="text-lg">
                                    <span className="font-medium">Age:</span> {applicant.age ?? "-"}
                                </p>
                                <p className="text-lg">
                                    <span className="font-medium">Gender:</span> {applicant.gender ?? "-"}
                                </p>
                                <p className="text-lg font-medium">
                                    Expected Salary: Rp {applicant.expectedSalary.toLocaleString()}
                                </p>
                            </div>
                        </Card>

                        {/* Application Actions */}
                        <ApplciantAction status={status} setStatus={setStatus as any} setIsModalOpen={setIsModalOpen} />
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 space-y-6">
                        {/* CV Preview */}
                        <div>
                            <p className="text-lg font-semibold text-muted-foreground mb-4">CV Preview</p>

                            <object
                                data={applicant.cvUrl ?? "/dummy-cv.pdf"}
                                type="application/pdf"
                                className="w-full h-[900px] border rounded-md mb-2"
                            >
                                <p className="text-center text-muted-foreground">
                                    Unable to display CV.{" "}
                                    <a
                                        href={applicant.cvUrl ?? "/dummy-cv.pdf"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        Download here
                                    </a>
                                </p>
                            </object>

                            {/* Tombol Download */}
                            <Button className="bg-indigo-600 hover:bg-indigo-900">
                                <a
                                    href={applicant.cvUrl ?? "/dummy-cv.pdf"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download CV
                                </a>
                            </Button>
                        </div>


                        {/* Education */}
                        <div className="space-y-2 text-lg">
                            <p className="font-semibold">Education</p>
                            <ul className="list-disc pl-5 space-y-2">
                                {applicant.education.map((edu, idx) => (
                                    <li key={idx}>
                                        <p className="font-medium">
                                            {edu.degree} in {edu.fieldOfStudy}
                                        </p>
                                        <p>
                                            {edu.university} ({new Date(edu.startDate).getFullYear()} -{" "}
                                            {new Date(edu.endDate).getFullYear()})
                                        </p>
                                        <p className="text-muted-foreground">{edu.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Experience */}
                        <div className="space-y-2 text-lg">
                            <p className="font-semibold">Experience</p>
                            <ul className="list-disc pl-5 space-y-2">
                                {applicant.experience.map((exp, idx) => (
                                    <li key={idx}>
                                        <p className="font-medium">{exp.position} at {exp.name}</p>
                                        <p>({new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()})</p>
                                        <p className="text-muted-foreground">{exp.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Certificates */}
                        <div className="space-y-2 text-lg">
                            <p className="font-semibold">Certificates</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {applicant.CertificatesCode.map((cert, idx) => (
                                    <li key={idx}>{cert.code}</li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal Calendar */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-4xl p-6 relative rounded-lg overflow-hidden">
                        <Button
                            variant={'ghost'}
                            className="absolute top-4 right-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X />
                        </Button>

                        <h2 className="text-2xl font-semibold mb-4">Select Interview Date & Time</h2>

                        <InterviewCalendar
                            existingEvents={existingSchedules as any}
                            onNewEventChange={(event) =>
                                setSelectedSlot(event ? (event.start as any) : null)
                            }
                        />

                        {selectedSlot && (
                            <Button
                                className="mt-4 bg-blue-600 text-white w-full py-2 px-4 rounded-lg hover:bg-blue-700"
                                onClick={() => {
                                    alert(`Interview Scheduled on: ${selectedSlot.toLocaleString()}`);
                                    setStatus("Interview Scheduled");
                                    setIsModalOpen(false);
                                }}
                            >
                                Save Interview
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailApplicationPage;

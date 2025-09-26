"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { apiCall } from "@/helper/apiCall";
import { useSearchParams } from "next/navigation";;
import { toTitleCase } from "@/helper/toTitleCase";
import { useSchedulesStore } from "@/lib/zustand/scheduleStore";
import { schemaInterviewInput } from "@/validation/interview.validation";
import { useToast } from "@/components/basic-toast";
import { Dots_v2 } from "@/components/ui/spinner";
import { InterviewEvent } from "./BigCalender";
import ProfileCard from "./ProfileCard";
import RightSection from "./RightSection";
import CalendarModal from "./CalenderModal";
import ApplicantAction from "./ApplicantAction";
import { AllSchedules, DetailApplicant } from "@/types/postingsTypes";
const GridDetailApplication = () => {
    const [applicant, setApplicant] = useState<DetailApplicant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // global state
    const [rawSchedules, setRawSchedules] = useState<AllSchedules[]>([]);
    const { setNewSchedule } = useSchedulesStore();
    const toast = useToast();
    // lokal state untuk calendar
    const [calendarSchedules, setCalendarSchedules] = useState<InterviewEvent[]>([]);
    const [schedule, setSchedule] = useState<InterviewEvent | null>(null);
    const searchParams = useSearchParams();
    const application_id = searchParams.get("id");
    const isEdit = searchParams.get("action") === "edit";
    const getDetail = async () => {
        if (!application_id) return;
        try {
            const { data } = await apiCall.get(`/applications/detail/${application_id}`);
            if (data.success) setApplicant(data.data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };
    const getAllInterviewList = async () => {
        try {
            const { data } = await apiCall.get("/interviews/company/all");
            if (data.success) setRawSchedules(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    const getEditInterview = async () => {
        if (!application_id) return;
        try {
            const { data } = await apiCall.get(`/interviews/all/edit/${application_id}`);
            if (data.success) {
                // Set schedule edit dari backend
                setSchedule({
                    id: data.data.edit.interview_id,
                    title: data.data.edit.note,
                    start: new Date(data.data.edit.startDate),
                    end: new Date(data.data.edit.endDate),
                    location: data.data.edit.location,
                    isFixed: false,
                });

                // Set semua jadwal existing
                setRawSchedules(data.data.all);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const onSaveInterview = async () => {
        if (!schedule) return;
        const interview_id = schedule.id
        const parsed = schemaInterviewInput.safeParse({
            application_id: Number(application_id),
            startDate: (schedule.start as Date).toISOString(),
            endDate: (schedule.end as Date).toISOString(),
            note: schedule.title ?? "",
            location: schedule.location ?? "",
        });

        if (!parsed.success) {
            return toast.error(parsed.error.issues[0].message);
        }

        try {
            const endpoint = isEdit ? `/interviews/update/${interview_id}` : "/interviews/create";
            const { data } = isEdit ? await apiCall.patch(endpoint, parsed.data) : await apiCall.post(endpoint, parsed.data)
            if (data.success) {
                toast.success(data.message);
                setIsModalOpen(false);
                getDetail()
            }
        } catch (error) {
            console.error(error);
        }
    };
    // ---------- Effects ----------
    // Ambil detail applicant + semua jadwal
    useEffect(() => {
        getDetail();
        getAllInterviewList();
        if (isEdit) getEditInterview();
    }, [isEdit]);
    // Map raw schedules ke calendar
    useEffect(() => {
        if (rawSchedules.length === 0) return;

        const mapped: InterviewEvent[] = rawSchedules.map((item, idx) => ({
            id: idx,
            title: item.note || "Interview",
            start: new Date(item.startDate),
            end: new Date(item.endDate),
            isFixed: true,
        }));
        console.log('ini map', mapped)
        setCalendarSchedules(mapped);
    }, [rawSchedules]);
    // Set global schedule
    useEffect(() => {
        if (schedule && application_id) {
            setNewSchedule({
                application_id: Number(application_id),
                startDate: (schedule.start as Date).toISOString(),
                endDate: (schedule.end as Date).toISOString(),
                note: schedule.title ?? "" as any,
                location: schedule.location ?? "",
            });
        }
    }, [schedule, setNewSchedule, application_id]);

    if (!applicant) return <div className="container mx-auto px-8 md:px-20 my-8 flex justify-center items-center h-screen">
        <Dots_v2 />
    </div>
    return (
        <div className="container mx-auto px-8 md:px-20 my-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">
                    {applicant.name} <span className="text-neutral-500">/ {toTitleCase(applicant.status)}</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium mt-1">
                    {applicant.jobTitle ?? "-"} — Applied on {new Date(applicant.appliedOn).toLocaleDateString()}
                </p>
                <p className="text-lg text-muted-foreground font-medium">
                    Type: {toTitleCase(applicant.JobType ?? "-")} | Category: {toTitleCase(applicant.jobCategory ?? "-")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
                {/* Left Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <ProfileCard
                            profile_picture={applicant.profile_picture || undefined}
                            name={applicant.name}
                            score={isNaN(applicant.score) ? undefined : applicant.score}
                            email={applicant.email}
                            phone={applicant.phone}
                            address={applicant.address}
                            birthDate={applicant.birthDate}
                            age={applicant.age || undefined}
                            gender={applicant.gender}
                            expectedSalary={applicant.expectedSalary}
                        />

                        {/* Actions */}
                        <ApplicantAction status={applicant.status} setIsModalOpen={setIsModalOpen} interview={applicant.interview} getDetail={getDetail} />
                    </div>
                </div>
                {/* Right Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 space-y-6">
                        {/* CV Preview */}
                        <RightSection
                            cvUrl={applicant.cvUrl}
                            education={applicant.education}
                            experience={applicant.experience}
                            certificates={applicant.CertificatesCode}
                        />
                        {/* Calendar Modal */}
                        {isModalOpen && (
                            <CalendarModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                isEdit={isEdit}
                                schedule={schedule}
                                existingEvents={calendarSchedules}
                                onScheduleChange={setSchedule}
                                onSaveInterview={onSaveInterview}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default GridDetailApplication;
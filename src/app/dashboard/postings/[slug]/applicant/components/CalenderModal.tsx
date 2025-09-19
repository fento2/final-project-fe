"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import InterviewCalendar, { InterviewEvent } from "./BigCalender";

type CalendarModalProps = {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    schedule: InterviewEvent | null;
    existingEvents: InterviewEvent[];
    onScheduleChange: (schedule: InterviewEvent | null) => void;
    onSaveInterview: () => void;
};

const CalendarModal = ({
    isOpen,
    onClose,
    isEdit,
    schedule,
    existingEvents,
    onScheduleChange,
    onSaveInterview,
}: CalendarModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-4xl p-6 relative rounded-lg overflow-hidden">
                <Button
                    variant="ghost"
                    className="absolute top-4 right-4"
                    onClick={onClose}
                >
                    <X />
                </Button>

                <h2 className="text-2xl font-semibold mb-4">Interview Schedule</h2>

                <InterviewCalendar
                    existingEvents={existingEvents}
                    editableSchedule={schedule}
                    onScheduleChange={onScheduleChange}
                />

                {schedule && (
                    <Button
                        className="mt-4 bg-blue-600 text-white w-full py-2 px-4 rounded-lg hover:bg-blue-700"
                        onClick={onSaveInterview}
                    >
                        {isEdit ? "Update Interview" : "Save Interview"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CalendarModal;

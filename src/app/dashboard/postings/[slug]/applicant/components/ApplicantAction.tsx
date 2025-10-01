"use client";

import { useToast } from "@/components/basic-toast";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dots_v2 } from "@/components/ui/spinner";
import { apiCall } from "@/helper/apiCall";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, CalendarCheck, Edit3, CircleX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ModalTextArea } from "./ModalTextArea";

interface ApplicantActionProps {
    status: string;
    setIsModalOpen: (val: boolean) => void;
    interview: Interview;
    getDetail: () => void;
}

interface Interview {
    startDate?: string;
    endDate?: string;
    note?: string;
    location?: string;
}

export enum Status {
    SUBMITTED = "SUBMITTED",
    INTERVIEW = "INTERVIEW",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
}

const statusColors = {
    SUBMITTED: "bg-yellow-100 text-yellow-800",
    INTERVIEW: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

const ApplicantAction = ({ setIsModalOpen, status, interview, getDetail }: ApplicantActionProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const application_id = searchParams.get('id');
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [editorStatus, setEditorStatus] = useState<Status | null>(null);
    const [text, setText] = useState('');

    const formattedStart = interview.startDate
        ? format(new Date(interview.startDate), "dd MMM yyyy, HH:mm")
        : "-";
    const formattedEnd = interview.endDate
        ? format(new Date(interview.endDate), "dd MMM yyyy, HH:mm")
        : "-";

    const handleEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("action", "edit");
        router.replace(`?${params.toString()}`);
        setIsModalOpen(true);
    };

    const handleOpenEditor = (statusType: Status) => {
        setEditorStatus(statusType);
        setText('');
        setShowEditor(true);
    };

    const handleSend = async () => {
        if (!editorStatus) return;

        try {
            setLoading(true);
            const { data } = await apiCall.patch(
                `/applications/update/${editorStatus}/${application_id}`,
                { message: text }
            );
            if (data.success) {
                toast.success(data.message);
                getDetail();
                setShowEditor(false);
            }
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const renderStatusIcon = () => {
        switch (status) {
            case Status.SUBMITTED: return <Clock className="w-5 h-5" />;
            case Status.INTERVIEW: return <CalendarCheck className="w-5 h-5" />;
            case Status.ACCEPTED: return <CheckCircle className="w-5 h-5" />;
            case Status.REJECTED: return <XCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    const renderInfoSection = () => {
        switch (status) {
            case Status.SUBMITTED:
                return <p className="text-gray-700">Pelamar belum dijadwalkan interview. Silakan klik <strong>"Set Interview"</strong> untuk menentukan tanggal, waktu, dan lokasi.</p>;
            case Status.INTERVIEW:
                return (
                    <div className="space-y-2 relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1 border border-gray-300 hover:bg-gray-100"
                            onClick={handleEdit}
                        >
                            <Edit3 />
                        </Button>
                        <p><strong>Start:</strong> {formattedStart}</p>
                        <p><strong>End:</strong> {formattedEnd}</p>
                        <p><strong>Location/Zoom:</strong> {interview.location ?? "-"}</p>
                        {interview.note && <p><strong>Note:</strong> {interview.note}</p>}
                    </div>
                );
            case Status.ACCEPTED: return <p className="text-green-700 font-medium">Pelamar telah diterima.</p>;
            case Status.REJECTED: return <p className="text-red-700 font-medium">Pelamar ditolak.</p>;
            default: return null;
        }
    };

    return (
        <Card className="p-6 space-y-5 shadow-md border border-gray-200 relative">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {renderStatusIcon()} Application Actions
                </CardTitle>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>{status}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">{renderInfoSection()}</div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {status === Status.SUBMITTED && (
                    <>
                        <Button
                            className="flex-1 bg-green-500 border-2 border-green-500 text-white font-medium text-lg md:p-5 rounded-lg shadow-md hover:bg-green-700 transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Set Interview
                        </Button>
                        <Button
                            className="flex-1 bg-red-500/5 border-2 border-red-500 text-black font-medium md:p-5 text-lg rounded-lg shadow-md hover:bg-red-500 hover:text-white transition"
                            onClick={() => handleOpenEditor(Status.REJECTED)}
                        >
                            {loading ? <Dots_v2 /> : <><CircleX /> Reject</>}
                        </Button>
                    </>
                )}

                {status === Status.INTERVIEW && (
                    <>
                        <Button
                            className="flex-1 bg-indigo-500 border-2 border-indigo-500 text-white font-medium text-lg md:p-5 rounded-lg shadow-md hover:bg-indigo-700 transition"
                            onClick={() => handleOpenEditor(Status.ACCEPTED)}
                        >
                            {loading ? <Dots_v2 /> : <><CheckCircle /> Accept</>}
                        </Button>
                        <Button
                            className="flex-1 bg-red-500/5 border-2 border-red-500 text-black font-medium md:p-5 text-lg rounded-lg shadow-md hover:bg-red-500 hover:text-white transition"
                            onClick={() => handleOpenEditor(Status.REJECTED)}
                        >
                            {loading ? <Dots_v2 /> : <><CircleX /> Reject</>}
                        </Button>
                    </>
                )}
            </div>
            {/* Modal Text Area */}
            <ModalTextArea showEditor={showEditor} setShowEditor={setShowEditor} text={text} setText={setText} handleSend={handleSend} loading={loading} />
        </Card>
    );
};
export default ApplicantAction;

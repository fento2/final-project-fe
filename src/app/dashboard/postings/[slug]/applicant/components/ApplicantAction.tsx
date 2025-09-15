import { useToast } from "@/components/basic-toast";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ApplicantActionProps {
    status: string;
    setIsModalOpen: (val: boolean) => void;
    interview: Interview;
}

interface Interview {
    startDate?: string;
    endDate?: string;
    note?: string;
    location?: string;
}

enum Status {
    SUBMITTED = "SUBMITTED",
    INTERVIEW = "INTERVIEW",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
}

const ApplicantAction = ({ setIsModalOpen, status, interview }: ApplicantActionProps) => {
    const formattedStart = interview.startDate
        ? format(new Date(interview.startDate), "dd MMM yyyy, HH:mm")
        : "-";
    const formattedEnd = interview.endDate
        ? format(new Date(interview.endDate), "dd MMM yyyy, HH:mm")
        : "-";

    return (
        <Card className="p-6 space-y-4 shadow-lg border border-gray-200">
            <CardTitle className="text-xl font-semibold">Application Actions</CardTitle>

            {/* Info Section */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-1">
                {status === Status.SUBMITTED && (
                    <p className="text-gray-700">
                        Pelamar belum dijadwalkan interview. Silakan klik <strong>"Set Interview"</strong> untuk menentukan tanggal, waktu, dan lokasi.
                    </p>
                )}

                {status === Status.INTERVIEW && (
                    <div className="text-gray-700 space-y-1">
                        <p><strong>Start:</strong> {formattedStart}</p>
                        <p><strong>End:</strong> {formattedEnd}</p>
                        <p><strong>Location/Zoom:</strong> {interview.location ?? "-"}</p>
                        {interview.note && <p><strong>Note:</strong> {interview.note}</p>}
                    </div>
                )}

                {status === Status.ACCEPTED && (
                    <p className="text-green-700 font-medium">Pelamar telah diterima.</p>
                )}

                {status === Status.REJECTED && (
                    <p className="text-red-700 font-medium">Pelamar ditolak.</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {status === Status.SUBMITTED && (
                    <>
                        <Button
                            className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Set Interview
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition"
                        >
                            Reject
                        </Button>
                    </>
                )}

                {status === Status.INTERVIEW && (
                    <>
                        <Button
                            className="flex-1 bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Accept
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition"
                        >
                            Reject
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};

export default ApplicantAction;

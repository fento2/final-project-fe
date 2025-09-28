"use client";
import { useToast } from "@/components/basic-toast";
import { apiCall } from "@/helper/apiCall";
import formatDateID, { formatDateIDDateOnly } from "@/lib/formatDate";
import { AssessmentCertificateDTO } from "@/validation/assessmentCertificate.validation";
import { UserAssessmentDTO } from "@/validation/userAssessment.validation";
import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { QRCodeCanvas } from "qrcode.react";

type AssessmentCertificate = AssessmentCertificateDTO & {
    user_assessment: UserAssessmentDTO & {
        assessment: {
            skill_name: string,
        }
        user: {
            name: string,
            email: string,
            username: string,
        }
    },
}

export default function DetailCertificatePage() {
    const param = useParams();
    const [dataCertificate, setDataCertificate] = useState<AssessmentCertificate>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [isDownloading, setIsDownloading] = useState(false);
    const toast = useToast()

    const certificateRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await apiCall.get(`/assessmentCertificate/${param.slug}`);
            setDataCertificate(result.data.data);
        } catch (error) {
            setError("Failed to load your certificate. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [param.slug])

    const copyCode = async () => {
        if (!dataCertificate) return;
        try {
            await navigator.clipboard.writeText(dataCertificate.certificate_code);
            toast.info("Certificate code copied");
        } catch {
            toast.error("Failed to copy");
        }
    }

    const handlePrint = useReactToPrint({
        contentRef: certificateRef,
        documentTitle: `Certificate-${dataCertificate?.certificate_code}`,
        pageStyle: `
            @media print {
                @page {
                    size: A4;
                    margin: 20mm;
                }
            }
        `
    });

    return (
        <div className="container md:pl-20 mx-auto px-4 py-6">
            {isLoading && <p className="text-gray-500">Loading certificate…</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && !dataCertificate && (
                <p className="text-gray-600">Certificate not found.</p>
            )}

            {dataCertificate && (
                <div className="max-w-3xl mx-auto">
                    {/* Certificate Preview */}
                    <div ref={certificateRef} className="bg-white border rounded-xl shadow-sm p-8 mb-6 print:block">
                        <div className="text-center mb-8 border-b pb-6">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
                            <p className="text-lg text-gray-600">This is to certify that</p>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4 text-blue-600">
                                {dataCertificate.user_assessment.user?.name ?? dataCertificate.user_assessment.user?.username ?? "Unknown User"}
                            </h2>
                            <p className="text-lg text-gray-700 mb-2">has successfully completed the {dataCertificate.user_assessment.assessment.skill_name} assessment</p>
                            <p className="text-xl font-semibold text-gray-800">with a score of {dataCertificate.user_assessment.score ?? "N/A"}%</p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 mb-8 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Certificate Code</p>
                                <p className="font-mono font-bold text-lg">{dataCertificate.certificate_code}</p>
                            </div>
                            <div className="flex justify-center">
                                <QRCodeCanvas value={`${process.env.NEXT_PUBLIC_BASE_URL}/verify-certificate?id=${dataCertificate.certificate_code}`} size={200} level="H" />
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-gray-500 mb-1">Date Completed</p>
                                <p className="font-semibold text-lg">
                                    {dataCertificate.user_assessment.date_taken ? formatDateIDDateOnly(dataCertificate.user_assessment.date_taken.toString()) : "-"}
                                </p>
                            </div>
                        </div>

                        <div className="text-center pt-6 border-t">
                            <p className="text-sm text-gray-500">Certificate ID: {dataCertificate.assessment_certificate_id}</p>
                            <p className="text-sm text-gray-500 mt-2">This certificate can be verified using the certificate code above</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center mb-6">
                        <button
                            onClick={copyCode}
                            className="px-6 py-3 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                        >
                            Copy Certificate Code
                        </button>
                        <button
                            onClick={handlePrint}
                            // disabled={isDownloading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 hover:bg-blue-700"
                        >
                            {/* {isDownloading ? 'Generating PDF...' : 'Download Certificate'} */}
                            Download Certificate
                        </button>
                    </div>

                    <div className="bg-white border rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Certificate Details</h2>

                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Certificate ID</p>
                                    <p className="font-medium">{dataCertificate.assessment_certificate_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">User Assessment ID</p>
                                    <p className="font-medium">{dataCertificate.user_assessment_id}</p>
                                </div>
                            </div>

                            {dataCertificate.user_assessment && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="text-sm text-gray-500 mb-2">Assessment & User Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-500">Score</p>
                                            <p className="font-medium">{dataCertificate.user_assessment.score ?? "N/A"}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Date Taken</p>
                                            <p className="font-medium">{dataCertificate.user_assessment.date_taken ? formatDateID(dataCertificate.user_assessment.date_taken.toString()) : "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">User</p>
                                            <p className="font-medium">{dataCertificate.user_assessment.user?.name ?? dataCertificate.user_assessment.user?.username ?? "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">User Email</p>
                                            <p className="font-medium">{dataCertificate.user_assessment.user?.email ?? "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
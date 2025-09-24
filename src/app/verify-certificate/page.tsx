"use client";
import { apiCall } from "@/helper/apiCall";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type VerifyResponse = {
    assessment_certificate_id: number;
    user_assessment_id: number;
    certificate_code: string;
    createAt: string;
    updatedAt: string;
    user_assessment: {
        user_assessment_id: number;
        assessment_id: number;
        user_id: number;
        score: number;
        date_taken: string;
        createAt: string;
        updatedAt: string;
        user: {
            name: string;
            email: string;
            username: string;
        };
    };
};

export default function VerifyCertificatePage() {
    const [certificateId, setCertificateId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerifyResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    async function handleVerify(e?: React.FormEvent) {
        e?.preventDefault();
        setError(null);
        setResult(null);

        if (!certificateId.trim()) {
            setError("Masukkan ID sertifikat untuk melakukan verifikasi.");
            return;
        }

        setLoading(true);
        try {
            const res = await apiCall.get(`/assessmentCertificate/${certificateId}`);
            const data: VerifyResponse = res.data.data;
            if (!data) {
                setError("Sertifikat tidak ditemukan.");
            } else {
                setResult(data);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Terjadi kesalahan saat verifikasi.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setCertificateId("");
        setResult(null);
        setError(null);
    }

    useEffect(() => {
        const id = searchParams?.get("id");
        if (id) {
            setCertificateId(id);
        }
    }, [searchParams]);

    useEffect(() => {
        const id = searchParams?.get("id");
        if (id && certificateId === id) {
            handleVerify();
        }
    }, [certificateId, searchParams]);

    return (
        <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
            <div className="w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-semibold mb-4">Skill Certificate Verification</h1>

                <form onSubmit={handleVerify} className="max-w-lg w-full bg-white shadow p-6 rounded-md">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Certificate ID
                    </label>
                    <input
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        placeholder="Enter the certificate ID or verification code"
                        className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring"
                    />

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-red-100 px-4 py-2 rounded-md border text-red-600"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>

                    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                </form>

                {result && (
                    <div className="max-w-lg w-full mt-6 p-6 bg-white rounded-md shadow">
                        <h2 className="text-lg font-medium mb-2">
                            Hasil Verifikasi:{" "}
                            <span className="text-green-600">Valid</span>
                        </h2>

                        <div className="text-sm text-gray-700 space-y-1">
                            <div>
                                <strong>Kode Sertifikat:</strong> {result.certificate_code}
                            </div>

                            <div>
                                <strong>Nama Pemegang:</strong> {result.user_assessment.user.name}
                            </div>

                            <div>
                                <strong>Username / Email:</strong> {result.user_assessment.user.username} / {result.user_assessment.user.email}
                            </div>

                            <div>
                                <strong>Score:</strong> {result.user_assessment.score}
                            </div>

                            <div>
                                <strong>Tanggal Ujian:</strong>{" "}
                                {new Date(result.user_assessment.date_taken).toLocaleString()}
                            </div>

                            <div>
                                <strong>Diterbitkan:</strong>{" "}
                                {new Date(result.createAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiCall } from "@/helper/apiCall";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CertificateBadge from "@/components/core/CertificateBadge";

type Assessment = {
    assessment_id: number;
    skill_name: string;
    createAt: string;
    updatedAt: string;
    deletedAt?: string | null;
};

type UserAssessment = {
    user_assessment_id: number;
    assessment_id: number;
    user_id: number;
    score: number;
    date_taken: string;
    createAt: string;
    updatedAt: string;
    assessment: Assessment;
};

type AssessmentCertificate = {
    assessment_certificate_id: number;
    user_assessment_id: number;
    certificate_code: string;
    createAt: string;
    updatedAt: string;
    user_assessment: UserAssessment;
};

export default function ProfileCertificateSection() {
    const [certificates, setCertificates] = useState<AssessmentCertificate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiCall.get("/assessmentCertificate/getAllCertificate/byuserid");
                const payload = res.data?.data ?? res.data ?? res;
                if (!mounted) return;
                // payload might be array or object — normalize to array
                const list: AssessmentCertificate[] = Array.isArray(payload) ? payload : (payload?.items ?? payload?.rows ?? []);
                setCertificates(list ?? []);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.response?.data?.message ?? err?.message ?? "Failed to load certificates");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const formatDate = (iso?: string) => {
        if (!iso) return "-";
        try {
            return new Date(iso).toLocaleDateString();
        } catch {
            return iso;
        }
    };

    if (loading) {
        return (
            <Card className="p-4">
                <CardContent>
                    <p className="text-sm text-gray-500">Loading certificates...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Your issued assessment certificates</CardDescription>
                <CertificateBadge />
            </CardHeader>

            <CardContent className="space-y-3">
                {error && <p className="text-sm text-red-600">{error}</p>}

                {certificates.length === 0 ? (
                    <p className="text-sm text-gray-500">No certificates found.</p>
                ) : (
                    <div className="grid gap-3">
                        {certificates.map((c) => {
                            const ua = c.user_assessment;
                            const assessmentName = ua?.assessment?.skill_name ?? "Assessment";
                            return (
                                <Card key={c.assessment_certificate_id} className="bg-gray-50">
                                    <CardContent className="p-3">
                                        <div className="text-sm font-medium text-gray-800">{assessmentName}</div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            Score: <span className="font-medium">{ua?.score ?? "-"}</span> • Date: {formatDate(ua?.date_taken ?? c.createAt)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">Code: <span className="font-mono">{c.certificate_code}</span></div>
                                    </CardContent>
                                    <CardFooter className="flex gap-2 justify-end">
                                        <Link href={`/dashboard/my-skill/certificate/${encodeURIComponent(c.certificate_code)}`}>
                                            <Button variant="default" size="sm">View</Button>
                                        </Link>
                                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(c.certificate_code)}>Copy code</Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
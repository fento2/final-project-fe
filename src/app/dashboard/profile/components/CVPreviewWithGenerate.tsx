"use client";
import React, { useRef } from "react";
import type { BackendUser, CVData } from "@/types/cvGenerator";
import { usePrint } from "@/hooks/usePrint";

type Props = {
    user: BackendUser | null;
    cvData: CVData;
    btnLabel?: string;
};

export default function CVPreviewWithGenerate({ user, cvData, btnLabel = "Generate / Print CV" }: Props) {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const handlePrint = usePrint(previewRef, `CV_${user?.name ?? user?.username ?? "profile"}`);

    return (
        <div>
            <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
                {btnLabel}
            </button>

            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
            </div>

            <div ref={previewRef} className="">
                <div className="flex flex-col items-center">
                    <p className="font-semibold">{user?.profiles?.name}</p>
                    <p className="text-gray-600">{cvData.headline}</p>

                    <div className="flex justify-center text-sm text-gray-600 gap-2 mt-2">
                        {[
                            user?.email ? <span key="e">Email: {user.email}</span> : null,
                            user?.profiles?.phone ? <span key="p">Phone: {user.profiles.phone}</span> : null,
                            user?.profiles?.address ? <span key="a">Address: {user.profiles.address}</span> : null,
                        ]
                            .filter(Boolean)
                            .map((node, idx, arr) =>
                                idx < arr.length - 1 ? (
                                    <span key={idx} className="flex items-center">
                                        {node}
                                        <span className="px-2 text-gray-300">|</span>
                                    </span>
                                ) : (
                                    <span key={idx} className="flex items-center">{node}</span>
                                )
                            )}
                    </div>
                </div>

                <p className="mt-4">{cvData.summary}</p>

                {user?.experience?.length ? (
                    <div className="mt-4">
                        <p className="text-sm font-medium">Experience</p>
                        <ul className="text-sm text-gray-700 list-disc pl-5">
                            {user.experience.slice(0, 3).map((exp) => (
                                <li key={exp.experience_id}>
                                    {exp.position} — {exp.name} ({new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"})
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Certificates</p>
                    {(!user?.user_assessment || user.user_assessment.filter((ua) => ua.assessment_certificates).length === 0) ? (
                        <p className="text-sm text-gray-500">No certificates found.</p>
                    ) : (
                        <div className="grid gap-3">
                            {user.user_assessment
                                .filter((ua) => ua.assessment_certificates)
                                .map((ua) => {
                                    const c = ua.assessment_certificates!;
                                    return (
                                        <article key={ua.user_assessment_id} className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50">
                                            <div>
                                                <div className="text-sm font-medium text-gray-800">Certificate</div>
                                                <div className="text-xs text-gray-600 mt-1">Code: <span className="font-mono">{c.certificate_code}</span></div>
                                                <div className="text-xs text-gray-500">Date: {new Date(c.createAt).toLocaleDateString()} • Score: {ua.score}</div>
                                            </div>
                                        </article>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { BackendUser, CVData } from "@/types/cvGenerator";
import { usePrint } from "@/hooks/usePrint";
import { apiCall } from "@/helper/apiCall";
import { UserSubscriptionActiveDTO } from "@/types/userSubscription";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { UserCompanyItem } from "@/types/userCompany";

type Props = {
    user: BackendUser | null;
    cvData: CVData;
    btnLabel?: string;
    userCompany?: UserCompanyItem[];
};

export default function CVPreviewWithGenerate({ user, cvData, btnLabel = "Generate / Print CV", userCompany }: Props) {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const handlePrint = usePrint(previewRef, `CV_${user?.name ?? user?.username ?? "profile"}`);
    const [subActive, setSubActive] = useState(false);

    const checkSub = async () => {
        try {
            const result = await apiCall.get("/userSubscription");
            const data: UserSubscriptionActiveDTO = result.data.data;

            if (Array.isArray(data) && data.length > 0) {
                setSubActive(true);
            } else {
                setSubActive(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkSub()
    }, [])

    return (
        <div>
            <Button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full print:hidden"
                // aria-label="Generate and print CV"
                disabled={!subActive}
            >
                {btnLabel}
            </Button>

            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
            </div>

            <div ref={previewRef} className="">
                <div className="flex flex-col items-center">
                    <p className="font-semibold">{user?.name ?? user?.username}</p>
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

                <p className="mt-4 text-sm text-gray-700">{cvData.summary}</p>

                {user?.education?.length ? (
                    <div className="mt-4">
                        <p className="text-sm font-medium">Education</p>
                        <ul className="text-sm text-gray-700 list-disc pl-5">
                            {user.education.map((ed) => (
                                <li key={ed.education_id}>
                                    {ed.university} — {ed.degree} in {ed.fieldOfStudy} ({new Date(ed.startDate).getFullYear()} - {ed.endDate ? new Date(ed.endDate).getFullYear() : "Present"})
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {user?.experience?.length ? (
                    <div className="mt-4">
                        <p className="text-sm font-medium">Experience</p>
                        <ul className="text-sm text-gray-700 list-disc pl-5">
                            {user.experience.slice(0, 3).map((exp) => (
                                <li key={exp.experience_id}>
                                    {exp.position} — {exp.name} ({new Date(exp.startDate).toLocaleString("en-US", { month: "long", year: "numeric" })} - {exp.endDate ? new Date(exp.endDate).toLocaleString("en-US", { month: "long", year: "numeric" }) : "Present"})
                                </li>
                            ))}
                            {
                                userCompany && (
                                    userCompany.map((val) => (
                                        <li key={val.user_company_id}>
                                            {val.company.name} ({new Date(val.start_date).toLocaleString("en-US", { month: "long", year: "numeric" })} - {val.end_date ? new Date(val.end_date).toLocaleString("en-US", { month: "long", year: "numeric" }) : "Present"})
                                        </li>
                                    ))
                                )
                            }
                        </ul>
                    </div>
                ) : null}

                {user?.userSkills && user.userSkills.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm font-medium mb-2">Skills</p>
                        <ul className="text-sm text-gray-700 list-disc pl-5">
                            {
                                user.userSkills.map((val) => (
                                    <li key={val.id}>
                                        {val.skill?.name}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                )}

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
                                            <div className="flex justify-between w-full">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">Certificate</div>
                                                    <div className="text-xs text-gray-600 mt-1">Code: <span className="font-mono">{c.certificate_code}</span></div>
                                                    <div className="text-xs text-gray-500">Date: {new Date(c.createAt).toLocaleDateString()} • Score: {ua.score}</div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <QRCodeCanvas value={`${process.env.NEXT_PUBLIC_BASE_URL}/verify-certificate?id=${c.certificate_code}`} size={128} level="H" />
                                                </div>
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
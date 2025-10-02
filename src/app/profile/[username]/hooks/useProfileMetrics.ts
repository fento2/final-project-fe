import { useMemo } from "react";
import { Experience } from "../types/profile.types";

export function useProfileMetrics(experiences: Experience[], userAssessments: any[]) {
    const yearsExperience = useMemo(() => {
        try {
            const valid = experiences.filter((e) => e.startDate);
            if (valid.length === 0) return null;
            const starts = valid.map((e) => new Date(e.startDate as string).getTime());
            const ends = valid.map((e) => new Date(e.endDate || Date.now()).getTime());
            const minStart = Math.min(...starts);
            const maxEnd = Math.max(...ends);
            const diffYears = (maxEnd - minStart) / (1000 * 60 * 60 * 24 * 365.25);
            return Math.max(0, Math.round(diffYears));
        } catch {
            return null;
        }
    }, [experiences]);

    // Show only perfect-score assessments (100%)
    const perfectAssessments = useMemo(() => {
        try {
            return (userAssessments || []).filter((a: any) => Number(a?.score) === 100);
        } catch {
            return [] as any[];
        }
    }, [userAssessments]);

    return {
        yearsExperience,
        perfectAssessments,
    };
}
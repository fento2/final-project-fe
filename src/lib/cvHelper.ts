import { BackendUser, Experience } from "@/types/cvGenerator";

export function getLatestExperience(exps?: Experience[]): Experience | undefined {
    if (!exps || exps.length === 0) return undefined;
    return [...exps].sort((a, b) => {
        const aEnd = a.endDate ? new Date(a.endDate).getTime() : Date.now();
        const bEnd = b.endDate ? new Date(b.endDate).getTime() : Date.now();
        return bEnd - aEnd;
    })[0];
}

export function yearsOfExperience(exps?: Experience[]): number {
    if (!exps || exps.length === 0) return 0;
    const starts = exps.map(e => new Date(e.startDate).getTime());
    const ends = exps.map(e => (e.endDate ? new Date(e.endDate).getTime() : Date.now()));
    const minStart = Math.min(...starts);
    const maxEnd = Math.max(...ends);
    const years = (maxEnd - minStart) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.round(years));
}

export function deriveHeadline(u: BackendUser): string {
    const latest = getLatestExperience(u.experience);
    if (latest?.position) return latest.position;

    const firstSkill =
        u.userSkills?.[0]?.skill?.name ??
        (u.userSkills?.[0] as any)?.skill_name ??
        u.userSkills?.find(s => s?.skill?.name)?.skill?.name ??
        (u.userSkills?.find(s => (s as any)?.skill_name) as any)?.skill_name;

    if (firstSkill) return `${firstSkill} Professional`;
    return "Professional";
}

export function deriveSummary(u: BackendUser): string {
    const name = u.profiles?.name || u.name || u.username || "Professional";
    const latest = getLatestExperience(u.experience);
    const yrs = yearsOfExperience(u.experience);
    const company = latest?.name;
    const position = latest?.position;

    const parts: string[] = [];
    const headerParts: string[] = [];
    if (position) headerParts.push(position);
    if (yrs) headerParts.push(`${yrs}+ years`);
    if (company) headerParts.push(`at ${company}`);
    parts.push(`${name}${headerParts.length ? ` — ${headerParts.join(" • ")}` : ""}.`);

    if (u.user_assessment && u.user_assessment.length) {
        const passed = u.user_assessment.filter(a => typeof a.score === "number" && a.score >= 60);
        if (passed.length) parts.push(`Certified in ${passed.length} assessment${passed.length > 1 ? "s" : ""}.`);
    }

    if (u.userSkills && u.userSkills.length) {
        const skills = u.userSkills
            .slice(0, 5)
            .map(s => s?.skill?.name ?? (s as any).skill_name ?? "")
            .filter(Boolean)
            .join(", ");
        if (skills) parts.push(`Key skills: ${skills}.`);
    }

    return parts.join(" ");
}
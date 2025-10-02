import { apiCall } from "@/helper/apiCall";
import { generateCompanySlug } from "@/helper/companySlugHelper";
import { Job } from "../types/job.types";

// helper: build absolute URL if backend returns relative path
export function toAbsolute(url?: string | null): string | null {
    if (!url || typeof url !== "string") return null;
    if (/^https?:\/\//i.test(url)) return url;
    const beBase = process.env.NEXT_PUBLIC_URL_BE || "";
    if (!beBase) return url;
    return `${beBase}${url.startsWith("/") ? "" : "/"}${url}`;
}

// map experiences to UI Jobs and enrich with company logos
export async function mapExperiencesToJobsWithLogos(data: any[]): Promise<Job[]> {
    const toYmd = (d: Date | null) =>
        d && !Number.isNaN(d.getTime())
            ? `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
            : "";

    const mappedBase: Job[] = (Array.isArray(data) ? data : []).map((exp) => {
        const start = exp?.startDate ? new Date(exp.startDate) : null;
        const end = exp?.endDate ? new Date(exp.endDate) : null;
        return {
            nameJob: exp?.position || "-",
            nameCompany: exp?.name || "-",
            status: end ? "Past" : "Current",
            wage: "-",
            periodStart: toYmd(start),
            periodEnd: end ? toYmd(end) : "",
        } as Job;
    });

    // fetch logos per unique company name
    const names = Array.from(
        new Set(
            mappedBase
                .map((m) => m.nameCompany)
                .filter((n) => n && n !== "-")
        )
    );

    const logoByName = new Map<string, string | null>();
    await Promise.all(
        names.map(async (name) => {
            try {
                const slug = generateCompanySlug(name);
                if (!slug) return;
                const res = await apiCall.get(`/company/name/${slug}`);
                const company = res?.data?.data ?? res?.data ?? {};
                const logo = toAbsolute(company?.profile_picture) || null;
                logoByName.set(name, logo);
            } catch (e) {
                // ignore failures for individual lookups
                logoByName.set(name, null);
            }
        })
    );

    const enriched = mappedBase.map((m) => ({
        ...m,
        companyLogo: logoByName.get(m.nameCompany) ?? null,
    }));

    // sort newest start first
    enriched.sort((a, b) => new Date(b.periodStart || 0).getTime() - new Date(a.periodStart || 0).getTime());
    return enriched;
}
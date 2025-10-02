import { useEffect, useMemo, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";

type Education = {
  university?: string;
  institution?: string;
  field_of_study?: string;
};

type CompanyResponse = any;

/**
 * Check if there are employees at the given company who have the same education institution
 * as the current user. Best-effort: gracefully degrades if backend doesn't provide nested user education.
 */
export function useAlumniAtCompany(companyName?: string) {
  const { isLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [institutions, setInstitutions] = useState<string[]>([]);

  const hasMatch = matchCount > 0;

  useEffect(() => {
    const run = async () => {
      if (!isLogin) return; // Only meaningful for logged-in users
      if (!companyName || companyName === "Unknown Company") return;
      try {
        setLoading(true);

        // 1) Get current user's educations
        const eduRes = await apiCall.get("/account/education/list");
        const eduList: Education[] = Array.isArray(eduRes?.data?.data)
          ? eduRes.data.data
          : Array.isArray(eduRes?.data)
          ? eduRes.data
          : [];
        const userInstitutions = (eduList || [])
          .map((e) => (e.institution || e.university || "").trim())
          .filter((s) => s.length > 0)
          .map((s) => s.toLowerCase());
        if (userInstitutions.length === 0) return;

        // 2) Get company details (may include user_company relation)
        const compRes = await apiCall.get(`/company/name/${encodeURIComponent(companyName)}`);
        const company: CompanyResponse = compRes?.data?.data || compRes?.data || {};
        const userCompanies: any[] = Array.isArray(company?.user_company) ? company.user_company : [];

        // 3) Try to read employees' education from typical shapes
        let totalMatches = 0;
        const matchedInstitutions = new Set<string>();
        for (const uc of userCompanies) {
          const user = uc.user || uc.User || uc.Users || {};
          const educations: Education[] = Array.isArray(user?.education)
            ? user.education
            : Array.isArray(user?.Education)
            ? user.Education
            : [];
          for (const ed of educations) {
            const inst = (ed.institution || ed.university || "").trim();
            if (!inst) continue;
            const key = inst.toLowerCase();
            if (userInstitutions.includes(key)) {
              totalMatches += 1;
              matchedInstitutions.add(inst);
            }
          }
        }

        if (totalMatches > 0) {
          setMatchCount(totalMatches);
          setInstitutions(Array.from(matchedInstitutions));
        } else {
          setMatchCount(0);
          setInstitutions([]);
        }
      } catch (_e) {
        // Silent fail; simply no badge rendered
        setMatchCount(0);
        setInstitutions([]);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, isLogin]);

  const summary = useMemo(() => {
    if (!hasMatch) return "";
    if (institutions.length === 1) {
      return `Alumni dari ${institutions[0]} juga bekerja di sini`;
    }
    if (institutions.length === 2) {
      return `Alumni dari ${institutions[0]} dan ${institutions[1]} juga bekerja di sini`;
    }
    return `Alumni dari beberapa universitas yang sama juga bekerja di sini`;
  }, [hasMatch, institutions]);

  return { loading, hasMatch, matchCount, institutions, summary };
}

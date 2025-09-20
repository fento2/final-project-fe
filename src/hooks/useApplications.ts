import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/zustand/authStore";
import { getUserApplications, ApplicationListResponse, ApplicationResponse } from "@/fetch/applicationFetch";

export function useApplications(initialPage: number = 1, pageSize: number = 10) {
  const [data, setData] = useState<ApplicationListResponse | null>(null);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(pageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { isLogin, checkLogin } = useAuthStore();

  const fetchData = async (p: number = page) => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserApplications(p, limit);
      setData(res);
      setApplications(res.applications || []);
    } catch (err: any) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth initialization to complete
    if (checkLogin) return;
    // If not logged in, clear and stop
    if (!isLogin) {
      setData(null);
      setApplications([]);
      setLoading(false);
      setError("");
      return;
    }

    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, isLogin, checkLogin]);

  return {
    data,
    applications,
    page,
    limit,
    total: data?.total ?? 0,
    loading,
    error,
    reload: () => fetchData(page),
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    setPage,
  };
}

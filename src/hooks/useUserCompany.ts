import { useCallback, useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { UserCompanyItem } from "@/types/userCompany";

export function useUserCompanies() {
    const [items, setItems] = useState<UserCompanyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const fetchUserCompanies = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await apiCall.get("/user-companies");
            // backend may return array at root or wrapped; normalize:
            const list: UserCompanyItem[] = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data?.data?.data)
                        ? res.data.data.data
                        : [];
            setItems(list);

        } catch (e) {

            setError("Gagal memuat data perusahaan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserCompanies();
    }, [fetchUserCompanies]);

    return { items, loading, error, refetch: fetchUserCompanies };
}
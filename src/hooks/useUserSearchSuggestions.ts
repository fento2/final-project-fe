"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiCall } from "@/helper/apiCall";

export type UserSuggestion = {
    username: string;
    name?: string;
    profile_picture?: string;
    role?: string;
    slug?: string;
};

export function useUserSearchSuggestions(query: string) {
    const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            setLoading(false);
            setError(null);
            return;
        }

        const run = async () => {
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;
            setLoading(true);
            setError(null);
            try {
                // 1) Try backend public search by username or name
                // Endpoint: GET /public/search?q=<query>
                // Expected: data: [{ username, name, profile_picture }]
                try {
                    const res = await apiCall.get(`/public/search`, {
                        signal: controller.signal,
                        params: { q: query },
                    });
                    const raw = (res as any)?.data?.data ?? (res as any)?.data;
                    if (Array.isArray(raw) && raw.length > 0) {
                        const arr = raw
                            .filter((u: any) => u && (u.username || u.name))
                            .filter((u: any) => u?.role?.toString?.()?.toUpperCase?.() !== 'DEVELOPER') // Filter out developers
                            .slice(0, 8)
                            .map((u: any) => ({
                                username: u.username,
                                name: u.name,
                                profile_picture: u.profile_picture,
                                role: (u.role || u.account_role || u.userRole) as string | undefined,
                                slug: u.slug as string | undefined,
                            } as UserSuggestion));
                        setSuggestions(arr);
                        setLoading(false);
                        return;
                    }
                } catch {
                    // ignore and fallback
                }

                // Local history suggestions (prefix match)
                const historyRaw = typeof window !== "undefined" ? window.localStorage.getItem("user-search-history") : null;
                const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];
                const lcq = query.toLowerCase();
                const historyMatched = history
                    .filter((u) => typeof u === "string" && u.toLowerCase().startsWith(lcq))
                    .slice(0, 5)
                    .map<UserSuggestion>((u) => ({ username: u }));

                // If backend has a search endpoint, replace this with it.
                // Temporary fallback: try fetching the exact username; if not found, just show history.
                let exact: any = null;
                try {
                    exact = await apiCall
                        .get(`/public/profile/${encodeURIComponent(query)}`, { signal: controller.signal })
                        .then((res) => (res as any)?.data?.data ?? (res as any)?.data);
                } catch {
                    // ignore
                }

                const list: UserSuggestion[] = [];
                if (exact && typeof exact === "object" && exact.username && exact?.role?.toString?.()?.toUpperCase?.() !== 'DEVELOPER') {
                    list.push({ username: exact.username, name: exact.name, profile_picture: exact.profile_picture });
                }
                // De-dup history items if same as exact
                const exactUsername = exact?.username?.toLowerCase?.();
                historyMatched.forEach((h) => {
                    if (h.username.toLowerCase() !== exactUsername) list.push(h);
                });

                setSuggestions(list);
            } catch (e: any) {
                if (e?.name === "CanceledError" || e?.name === "AbortError") return;
                const msg = e?.response?.data?.message || e?.message || "Failed to get suggestions";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        const t = setTimeout(run, 200); // debounce
        return () => clearTimeout(t);
    }, [query]);

    return { suggestions, loading, error };
}

"use client";
import { apiCall } from "@/helper/apiCall"
import { Company } from "@/types/userCompany";
import { useEffect, useState, useRef } from "react";
import CompanyCard from "./components/CompanyCard";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function TesCompanies() {
    const [data, setData] = useState<Company[]>([]);
    const [search, setNameFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const searchController = useRef<AbortController | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const fetchData = async (params?: URLSearchParams | null) => {
        if (searchController.current) {
            try { searchController.current.abort(); } catch { }
        }
        const controller = new AbortController();
        searchController.current = controller;

        try {
            setLoading(true);
            const url = `/company/find?${params?.toString()}`;
            const res = await apiCall.get(url, { signal: controller.signal });
            const items = res.data?.data?.data;
            setData(items);
            console.log(res.data.data);
        } catch (err: any) {
            const name = err?.name;
            if (name !== "CanceledError" && name !== "AbortError") console.error(err);
        } finally {
            setLoading(false);
            if (searchController.current === controller) searchController.current = null;
        }
    }

    useEffect(() => {
        const name = searchParams?.get("name") ?? "";
        const location = searchParams?.get("location") ?? "";
        setNameFilter(name);
        setLocationFilter(location);

        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (location) params.set("location", location);

        fetchData(params.toString() ? params : null);
    }, [searchParams]);

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("name", search.trim());
        if (locationFilter.trim()) params.set("location", locationFilter.trim());

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl);

        await fetchData(params.toString() ? params : null);
    };

    return (
        <div>
            <div className="my-4 flex justify-center gap-3">
                <div className="border flex flex-wrap px-4 py-3 rounded-md justify-center items-center gap-2">
                    <div className="min-w-sm">
                        <label className="text-sm font-medium block mb-1">Filter by name</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setNameFilter(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            placeholder="Cari nama perusahaan..."
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="min-w-sm">
                        <label className="text-sm font-medium block mb-1">Filter by location</label>
                        <input
                            type="text"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            placeholder="Kota / lokasi..."
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="flex h-full items-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setNameFilter("");
                                setLocationFilter("");
                                router.replace(pathname);
                                fetchData(null);
                            }}
                            className="h-10 px-3 rounded-md border bg-white"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={loading}
                            className="h-10 px-3 rounded-md border bg-blue-500 text-white disabled:opacity-50"
                        >
                            Search
                        </button>

                        <div className="text-sm text-muted-foreground">
                            {loading ? "Loading..." : `${data.length} hasil`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                {
                    data.map((val, idx) => (
                        <CompanyCard company={val} key={idx} />
                    ))
                }
            </div>
        </div>
    )
}
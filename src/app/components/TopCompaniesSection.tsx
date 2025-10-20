"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopCompanyCard } from "./CardTopCompanyHome";
import { apiCall } from "@/helper/apiCall";
import type { Company as SimpleCompany } from "@/types/userCompany";


export default function TopCompaniesSection() {
    const router = useRouter();
    // Align fetching with jobs/company page: use /company/find and take top 3
    const [topCompanies, setTopCompanies] = useState<SimpleCompany[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let aborted = false;
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await apiCall.get(`/company/find`, { signal: controller.signal });
                const items: SimpleCompany[] = res.data?.data?.data || [];
                if (!aborted) setTopCompanies(Array.isArray(items) ? items.slice(0, 3) : []);
            } catch (err: any) {
                if (err?.name === "CanceledError" || err?.name === "AbortError") return;

                if (!aborted) setError(err?.response?.data?.message || err?.message || "Failed to load companies");
            } finally {
                if (!aborted) setLoading(false);
            }
        })();
        return () => {
            aborted = true;
            try { controller.abort(); } catch { }
        };
    }, []);

    // Debug: Log the entire API response to understand backend structure


    const handleCompanyClick = (company: SimpleCompany) => {
        // Navigate to jobs/company page filtered by company name (same page logic)
        const params = new URLSearchParams();
        if (company.name) params.set("name", company.name);
        router.push(`/jobs/companies?${params.toString()}`);
    };

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Loading skeleton untuk kolom kiri */}
                    <div className="space-y-8">
                        <div>
                            <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="w-20 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loading skeleton untuk kolom kanan */}
                    <div className="h-80 bg-gray-200 rounded-3xl animate-pulse"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-red-600">Failed to load companies: {error}</p>
                </div>
            </section>
        );
    }

    // Jika tidak ada companies dari backend, jangan tampilkan section
    if (!loading && (!topCompanies || topCompanies.length === 0)) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Bagian kiri - Company List */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Top Companies</h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Explore and find the dream job opportunities with our best companies.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {topCompanies.map((company: SimpleCompany, index: number) => {


                            // Get website from company data
                            const website = (company as any).website || null;
                            const verified = Boolean((company as any).Users?.isVerfied || (company as any).verified);

                            return (
                                <div
                                    key={company.company_id || index}
                                    className="flex items-center gap-4 sm:gap-6 cursor-pointer group"
                                    onClick={() => handleCompanyClick(company)}
                                >
                                    {/* Nomor */}
                                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 min-w-[48px] sm:min-w-[64px] lg:min-w-[80px] text-center sm:text-left">
                                        {String(index + 1).padStart(2, "0")}.
                                    </div>

                                    {/* Card Company */}
                                    <div className="flex-1">
                                        <TopCompanyCard
                                            logo={company.profile_picture || "https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"}
                                            name={company.name}
                                            website={website}
                                            verified={verified}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Link
                        href="/jobs/companies"
                        className="text-gray-900 text-sm font-medium inline-block hover:text-indigo-600 transition-colors border-b border-gray-900 hover:border-indigo-600"
                    >
                        View All Top Companies
                    </Link>
                </div>

                {/* Bagian kanan - CTA Section */}
                <div className="relative">
                    {/* Background dengan gradient dan shape */}
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12 overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full opacity-30 transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-300 rounded-full opacity-40 transform translate-x-8 translate-y-8"></div>

                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                Ready to take the next step in your dream career with us?
                            </h3>

                            <p className="text-gray-600">
                                Join Horizon Jobs today and start exploring exciting job opportunities with top companies.
                            </p>

                            <div className="flex gap-4 pt-4">
                                <Link href="/contact" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                    Contact Us
                                </Link>
                                <Link href="/services" className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Device mockup */}
                        <div className="absolute bottom-0 right-0 w-48 h-32 lg:w-64 lg:h-40">
                            <div className="absolute bottom-4 right-4 w-32 h-20 lg:w-40 lg:h-24 bg-gray-900 rounded-lg transform rotate-12">
                                <div className="w-full h-full bg-gray-800 rounded-lg relative overflow-hidden">
                                    <div className="absolute inset-2 bg-white rounded"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 w-24 h-16 lg:w-32 lg:h-20 bg-orange-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

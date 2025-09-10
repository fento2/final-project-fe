"use client";

import Link from "next/link";
import { TopCompanyCard } from "./CardTopCompanyHome";
import { useTopCompanies } from "@/hooks/useCompanies";

export default function TopCompaniesSection() {
    const { companies: topCompanies, loading, error } = useTopCompanies(3);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading top companies...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-red-600">Failed to load companies: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Bagian kiri */}
                <div>
                    <h2 className="text-2xl font-bold">Top Companies</h2>
                    <p className="text-gray-600 mb-6">
                        Discover leading companies in various industries and explore exciting career opportunities
                    </p>

                    <div className="space-y-6">
                        {topCompanies.map((company: any, index: number) => (
                            <div
                                key={company.id || company.company_id}
                                className="grid grid-cols-[60px_1fr] gap-4 items-center"
                            >
                                {/* Nomor */}
                                <div className="text-3xl font-bold text-indigo-600">
                                    {String(index + 1).padStart(2, "0")}.
                                </div>

                                {/* Card Company */}
                                <TopCompanyCard
                                    logo={company.logo || company.profile_picture}
                                    name={company.name}
                                    rating={company.rating || 4}
                                    employees={company.employees || 100}
                                    jobsOpen={company.jobsOpen || 5}
                                />
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/jobs/companies"
                        className="text-indigo-600 text-sm font-medium mt-6 inline-block hover:underline"
                    >
                        View All Top Companies
                    </Link>
                </div>

                {/* Bagian kanan */}
                <div className="hidden md:block">
                    <div className="rounded-lg p-8 bg-gray-50">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Looking for Top Companies?
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Explore opportunities with leading employers in your field
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Active Companies:</span>
                                <span className="font-semibold text-indigo-600">150+</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Open Positions:</span>
                                <span className="font-semibold text-indigo-600">2,500+</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Industries:</span>
                                <span className="font-semibold text-indigo-600">25+</span>
                            </div>
                        </div>

                        <Link
                            href="/jobs/companies"
                            className="block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 mt-6"
                        >
                            Browse All Companies
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

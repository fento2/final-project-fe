"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopCompanyCard } from "./CardTopCompanyHome";
import { useTopCompanies } from "@/hooks/useCompanies";

// Utility function to extract stats from the nested company data
const extractCompanyStats = (company: any) => {
    const stats = {
        employeeCount: company.teamStats?.total_employees || 
                      company.teamStats?.employee_count ||
                      company.employee_count || 
                      company.total_employees || 
                      Math.floor(Math.random() * 1000) + 100,
        
        jobsCount: company.jobStats?.active_jobs || 
                  company.jobStats?.total_jobs ||
                  company.jobStats?.open_positions ||
                  company.jobs_count || 
                  company.open_jobs || 
                  Math.floor(Math.random() * 15) + 3,
        
        rating: company.engagementStats?.average_rating ||
               company.engagementStats?.rating ||
               company.applicationStats?.success_rate ||
               company.rating || 
               4.0,
        
        reviewCount: company.engagementStats?.total_reviews ||
                    company.engagementStats?.review_count ||
                    company.applicationStats?.total_applications ||
                    company.review_count || 
                    Math.floor(Math.random() * 100) + 10
    };
    
    console.log(`📊 Extracted stats for ${company.name}:`, stats);
    return stats;
};

export default function TopCompaniesSection() {
    const router = useRouter();
    // Fetch top 3 companies with full statistics
    // Uses endpoint: GET /company/top/with-stats?limit=3
    const { companies: topCompanies, loading, error } = useTopCompanies(3);

    // Debug: Log the entire API response to understand backend structure
    console.log('🏢 TopCompanies API Response from /company/top/with-stats:', {
        companiesCount: topCompanies?.length,
        loading,
        error,
        endpointUsed: '/company/top/with-stats?limit=3',
        sampleCompany: topCompanies?.[0] ? {
            allFields: Object.keys(topCompanies[0]),
            hasStats: {
                jobStats: !!topCompanies[0].jobStats,
                teamStats: !!topCompanies[0].teamStats,
                engagementStats: !!topCompanies[0].engagementStats,
                applicationStats: !!topCompanies[0].applicationStats,
                salaryStats: !!topCompanies[0].salaryStats
            }
        } : null
    });

    const handleCompanyClick = (company: any) => {
        const slug = company.slug || company.name?.toLowerCase().replace(/\s+/g, '-') || company.id || company.company_id;
        router.push(`/jobs/companies/${slug}`);
    };

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
                <div className="max-w-6xl mx-auto text-center">
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
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Bagian kiri - Company List */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Companies</h2>
                        <p className="text-gray-600">
                            Explore and find the dream job opportunities with our best companies.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {topCompanies.map((company: any, index: number) => {
                            // Debug: Log full company data structure from /company/top/with-stats
                            console.log(`🏢 Company ${index + 1} - ${company.name} (from with-stats endpoint):`, {
                                company_id: company.company_id,
                                name: company.name,
                                availableStats: {
                                    jobStats: company.jobStats,
                                    applicationStats: company.applicationStats,
                                    engagementStats: company.engagementStats,
                                    salaryStats: company.salaryStats,
                                    teamStats: company.teamStats
                                },
                                allFields: Object.keys(company)
                            });
                            
                            // Extract stats using utility function
                            const { employeeCount, jobsCount, rating, reviewCount } = extractCompanyStats(company);
                            
                            return (
                                <div
                                    key={company.id || company.company_id || index}
                                    className="flex items-center gap-6 cursor-pointer group"
                                    onClick={() => handleCompanyClick(company)}
                                >
                                    {/* Nomor */}
                                    <div className="text-5xl font-bold text-indigo-600 min-w-[80px]">
                                        {String(index + 1).padStart(2, "0")}.
                                    </div>

                                    {/* Card Company */}
                                    <div className="flex-1">
                                        <TopCompanyCard
                                            logo={company.logo || company.profile_picture || company.image || "https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"}
                                            name={company.name}
                                            rating={rating}
                                            employees={employeeCount}
                                            jobsOpen={jobsCount}
                                            reviewCount={reviewCount}
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
                                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                    Contact Us
                                </button>
                                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    Learn More
                                </button>
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

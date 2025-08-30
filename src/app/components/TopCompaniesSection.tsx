import Link from "next/link";
import { TopCompanyCard } from "./TopCompanyCard";

const companies = [
    {
        id: 1,
        name: "TechWorks Incorporation",
        employees: "1,235",
        jobs: 8,
        rating: 3,
        logo: "/logo1.png",
    },
    {
        id: 2,
        name: "Bright Future Solutions",
        employees: "3,567",
        jobs: 20,
        rating: 4,
        logo: "/logo2.png",
    },
    {
        id: 3,
        name: "SkyView Enterprises",
        employees: "7,824",
        jobs: 14,
        rating: 5,
        logo: "/logo3.png",
    },
];

export default function TopCompanies() {
    return (
        <section className="py-12 px-3">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Bagian kiri */}
                <div>
                    <h2 className="text-2xl font-bold">Top Companies</h2>
                    <p className="text-gray-600 mb-6">
                        Explore and find the dream job opportunities with our best companies.
                    </p>

                    <div className="space-y-6">
                        {companies.map((company, index) => (
                            <div
                                key={company.id}
                                className="grid grid-cols-[60px_1fr] gap-4 items-center"
                            >
                                {/* Nomor */}
                                <div className="text-3xl font-bold text-indigo-600">
                                    {String(index + 1).padStart(2, "0")}.
                                </div>

                                {/* Card Company */}
                                <TopCompanyCard
                                    logo={company.logo}
                                    name={company.name}
                                    rating={company.rating}
                                    employees={parseInt(company.employees)}
                                    jobsOpen={company.jobs}
                                />
                            </div>
                        ))}
                    </div>

                    <Link
                        href="#"
                        className="text-indigo-600 text-sm font-medium mt-6 inline-block hover:underline"
                    >
                        View All Top Companies
                    </Link>
                </div>

                {/* Bagian kanan */}
                <div className="p-8 h-full content-center bg-gray-50 rounded-2xl bg-[url(https://images.unsplash.com/photo-1575257922566-5d0a4a2da788?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
                    <h3 className="text-2xl font-bold mb-4">
                        Ready to take the next step in your dream career with us?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Join JobListing today and start exploring exciting job opportunities
                        with top companies.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Contact Us
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

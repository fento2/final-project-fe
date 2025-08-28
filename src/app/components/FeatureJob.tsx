"use client"
import { useState } from "react";
import JobCard from "./JobCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const jobs = [
    {
        company: "UXLabs Company",
        // logo: "/company1.png",
        logo: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        postedDate: "Feb 18, 2023",
        location: "Chicago, IL",
        salary: "80,000 - 100,000 per year",
        title: "Software Developer",
        type: "Full Time",
        description:
            "Develop and maintain software applications and programs for our clients using various programming languages and platforms.",
        daysLeft: 25,
    },
    {
        company: "SkyView Enterprises",
        logo: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        postedDate: "Feb 20, 2023",
        location: "Los Angeles, CA",
        salary: "50,000 - 60,000 per year",
        title: "Graphic Designer",
        type: "Full Time",
        description:
            "Create visually appealing graphics, designs, layouts for clients to use in various media, including websites, social media, and prints.",
        daysLeft: 16,
    },
];

export default function FeatureJobSection() {
    const [page, setPage] = useState(2);

    return (
        <section className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Featured Jobs</h2>
                <p className="text-gray-500 mt-2">
                    Our current top picks for your dream career based on our current popular listing.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center">
                {jobs.map((job, i) => (
                    <JobCard key={i} {...job} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-10">
                <button
                    className={`px-3 py-2 rounded-md ${page <= 1 ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}>
                    <ChevronLeft />
                </button>
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        className={`px-4 py-2 rounded-lg ${num === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        onClick={() => setPage(num)}
                    >
                        {num.toString().padStart(2, "0")}
                    </button>
                ))}
                <button
                    className={`px-3 py-2 rounded-md ${page >= 5 ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setPage(page + 1)}
                    disabled={page >= 5}>
                    <ChevronRight />
                </button>
            </div>
        </section>
    )
}
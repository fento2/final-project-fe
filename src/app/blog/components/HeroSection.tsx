"use client";

import { Search } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="bg-white border-b py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-indigo-600 mb-3">Blog</span>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                    Career Insights & News
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Stay updated with the latest industry trends, career advice, and job market insights from Horizon Jobs.
                </p>

                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                            aria-label="Search articles"
                        />
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[
                        "Career Tips",
                        "Remote Work",
                        "Interviews",
                        "Tech Skills",
                        "Workplace",
                    ].map((tag) => (
                        <button
                            key={tag}
                            className="px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                            type="button"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

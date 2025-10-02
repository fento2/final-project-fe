"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

interface CompaniesHeroSectionProps {
    filters: {
        name: string;
        location: string;
    };
    onClearFilter: (filterType: 'name' | 'location') => void;
}

const CompaniesHeroSection: React.FC<CompaniesHeroSectionProps> = ({ filters, onClearFilter }) => {
    const activeFilters = [];
    if (filters.name) activeFilters.push({ type: 'name' as const, label: `Name: ${filters.name}` });
    if (filters.location) activeFilters.push({ type: 'location' as const, label: `Location: ${filters.location}` });

    return (
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
                <Image 
                    src="/images/bg_hero.jpg" 
                    alt="Companies background" 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/jobs" className="text-indigo-200 hover:text-white transition-colors">
                            Jobs
                        </Link>
                        <ChevronRight size={16} className="text-indigo-300" />
                        <span className="text-white font-medium">Companies</span>
                    </nav>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Discover Top Companies
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                        Explore leading companies and find your next career opportunity with the best employers in the industry.
                    </p>
                    
                    {/* Navigation buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link 
                            href="/jobs/browse" 
                            className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            Browse All Jobs
                        </Link>
                        <Link 
                            href="/jobs" 
                            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2 justify-center">
                        <span className="text-sm text-indigo-200 mr-2">Active filters:</span>
                        {activeFilters.map((filter, index) => (
                            <div
                                key={index}
                                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-sm flex items-center gap-2"
                            >
                                <span>{filter.label}</span>
                                <button
                                    onClick={() => onClearFilter(filter.type)}
                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompaniesHeroSection;
"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Discover Top Companies
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                        Explore leading companies and find your next career opportunity with the best employers in the industry.
                    </p>
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
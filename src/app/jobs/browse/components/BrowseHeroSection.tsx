"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Filters {
  categories: string[];
  types: string[];
  location: string[];
  tools: string[];
}

interface BrowseHeroSectionProps {
  filters?: Filters;
  onClearFilter?: (filterType: string, value: string) => void;
}

const BrowseHeroSection: React.FC<BrowseHeroSectionProps> = ({ filters, onClearFilter }) => {
  const hasActiveFilters = filters && (
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.location.length > 0 ||
    filters.tools.length > 0
  );
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/bg_hero.jpg" alt="hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <nav className="text-sm text-indigo-600 mb-4">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-2 text-gray-300">/</span>
          <a href="/jobs" className="hover:underline">Jobs</a>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">Browse</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          Browse Through<br />Variety of Jobs
        </h1>
        <p className="text-gray-600 max-w-2xl mb-6">
          Find the perfect role from startups to enterprise teams — filter by date, job type, location, tools, and salary to quickly narrow results.
        </p>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
              
              {filters?.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  Category: {category}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter('categories', category)}
                      className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {filters?.types.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  Type: {type}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter('types', type)}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {filters?.location.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  Location: {loc}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter('location', loc)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {filters?.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  Tool: {tool}
                  {onClearFilter && (
                    <button
                      onClick={() => onClearFilter('tools', tool)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHeroSection;

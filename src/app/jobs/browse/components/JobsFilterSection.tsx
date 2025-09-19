"use client";
import React from "react";
import { formatIDR, formatCompactIDR, IDR_SALARY_RANGES } from "@/lib/currencyHelper";
import { useFilterStats } from "@/hooks/useFilterStats";

export type Filters = {
    date: string;
    types: string[];
    tools: string[];
    location: string[];
    categories: string[];
    salaryMin: number;
    salaryMax: number;
};

interface JobsFilterSectionProps {
    filters: Filters;
    onChange: React.Dispatch<React.SetStateAction<Filters>>;
}

const JobsFilterSection: React.FC<JobsFilterSectionProps> = ({ filters, onChange }) => {
    const { stats, loading: statsLoading } = useFilterStats();

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <aside className="space-y-6">
                {/* Job Category Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Category</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            Object.entries(stats.categories)
                                .sort(([,a], [,b]) => b - a) // Sort by count descending
                                .slice(0, 5) // Show top 5
                                .map(([category, count]) => (
                                    <label key={category} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(category)}
                                                onChange={() =>
                                                    onChange({
                                                        ...filters,
                                                        categories: filters.categories.includes(category)
                                                            ? filters.categories.filter((x: string) => x !== category)
                                                            : [...filters.categories, category],
                                                    })
                                                }
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700">{category}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                ))
                        )}
                    </div>
                </div>
                {/* Date Posted Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Date Posted</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            ["Last 24 hours", "Last 3 days", "Last 7 days", "Anytime"].map((d) => {
                                const count = stats.datePosted[d] || 0;
                                return (
                                    <label key={d} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="date"
                                                checked={filters.date === d}
                                                onChange={() => onChange({ ...filters, date: d })}
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="text-gray-700">{d}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Job Type Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Type</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            Object.entries(stats.jobTypes)
                                .sort(([,a], [,b]) => b - a) // Sort by count descending
                                .map(([jobType, count]) => (
                                    <label key={jobType} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.types.includes(jobType)}
                                                onChange={() =>
                                                    onChange({
                                                        ...filters,
                                                        types: filters.types.includes(jobType)
                                                            ? filters.types.filter((x: string) => x !== jobType)
                                                            : [...filters.types, jobType],
                                                    })
                                                }
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700">{jobType}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                ))
                        )}
                    </div>
                </div>

                {/* Languages/Tools Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Languages</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            Object.entries(stats.languages)
                                .sort(([,a], [,b]) => b - a) // Sort by count descending
                                .slice(0, 5) // Show top 5
                                .map(([language, count]) => (
                                    <label key={language} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.tools.includes(language)}
                                                onChange={() =>
                                                    onChange({
                                                        ...filters,
                                                        tools: filters.tools.includes(language)
                                                            ? filters.tools.filter((x: string) => x !== language)
                                                            : [...filters.tools, language],
                                                    })
                                                }
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700">{language}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                ))
                        )}
                    </div>
                    {Object.keys(stats.languages).length > 5 && (
                        <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                            +{Object.keys(stats.languages).length - 5} more
                        </button>
                    )}
                </div>

                {/* Location Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Location</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            Object.entries(stats.locations)
                                .sort(([,a], [,b]) => b - a) // Sort by count descending
                                .slice(0, 6) // Show top 6
                                .map(([location, count]) => (
                                    <label key={location} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.location.includes(location)}
                                                onChange={() =>
                                                    onChange({
                                                        ...filters,
                                                        location: filters.location.includes(location)
                                                            ? filters.location.filter((x: string) => x !== location)
                                                            : [...filters.location, location],
                                                    })
                                                }
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700">{location}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                ))
                        )}
                    </div>
                    {Object.keys(stats.locations).length > 6 && (
                        <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                            +{Object.keys(stats.locations).length - 6} more
                        </button>
                    )}
                </div>

                {/* Tools Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Tools</h3>
                    <div className="space-y-2">
                        {statsLoading ? (
                            <div className="text-sm text-gray-500">Loading...</div>
                        ) : (
                            Object.entries(stats.tools)
                                .sort(([,a], [,b]) => b - a) // Sort by count descending
                                .slice(0, 6) // Show top 6
                                .map(([tool, count]) => (
                                    <label key={tool} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={filters.tools.includes(tool)}
                                                onChange={() =>
                                                    onChange({
                                                        ...filters,
                                                        tools: filters.tools.includes(tool)
                                                            ? filters.tools.filter((x: string) => x !== tool)
                                                            : [...filters.tools, tool],
                                                    })
                                                }
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-700">{tool}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">({count})</span>
                                    </label>
                                ))
                        )}
                    </div>
                    {Object.keys(stats.tools).length > 6 && (
                        <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                            +{Object.keys(stats.tools).length - 6} more
                        </button>
                    )}
                </div>

                {/* Salary Range */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Gaji (IDR)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Gaji Min.</span>
                            <span>Gaji Max.</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span>{formatCompactIDR(IDR_SALARY_RANGES.min)}</span>
                            <span>{formatCompactIDR(IDR_SALARY_RANGES.max)}</span>
                        </div>
                        
                        {/* Dual Range Slider */}
                        <div className="relative mt-4">
                            {/* Min Salary Slider */}
                            <input
                                type="range"
                                min={IDR_SALARY_RANGES.min}
                                max={IDR_SALARY_RANGES.max}
                                step={IDR_SALARY_RANGES.step}
                                value={Math.min(filters.salaryMin, filters.salaryMax - IDR_SALARY_RANGES.step)}
                                onChange={(e) => onChange({ 
                                    ...filters, 
                                    salaryMin: Math.min(parseInt(e.target.value), filters.salaryMax - IDR_SALARY_RANGES.step) 
                                })}
                                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10 range-slider"
                            />
                            
                            {/* Max Salary Slider */}
                            <input
                                type="range"
                                min={IDR_SALARY_RANGES.min}
                                max={IDR_SALARY_RANGES.max}
                                step={IDR_SALARY_RANGES.step}
                                value={Math.max(filters.salaryMax, filters.salaryMin + IDR_SALARY_RANGES.step)}
                                onChange={(e) => onChange({ 
                                    ...filters, 
                                    salaryMax: Math.max(parseInt(e.target.value), filters.salaryMin + IDR_SALARY_RANGES.step) 
                                })}
                                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 range-slider"
                            />

                            {/* Slider Track */}
                            <div className="relative w-full h-2 bg-gray-200 rounded-lg">
                                <div 
                                    className="absolute h-2 bg-indigo-600 rounded-lg"
                                    style={{
                                        left: `${((Math.min(filters.salaryMin, filters.salaryMax - IDR_SALARY_RANGES.step) - IDR_SALARY_RANGES.min) / (IDR_SALARY_RANGES.max - IDR_SALARY_RANGES.min)) * 100}%`,
                                        width: `${((Math.max(filters.salaryMax, filters.salaryMin + IDR_SALARY_RANGES.step) - Math.min(filters.salaryMin, filters.salaryMax - IDR_SALARY_RANGES.step)) / (IDR_SALARY_RANGES.max - IDR_SALARY_RANGES.min)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Current Selection Display */}
                        <div className="text-center mt-4">
                            <span className="text-xs text-gray-500">
                                {formatCompactIDR(Math.min(filters.salaryMin, filters.salaryMax - IDR_SALARY_RANGES.step))} - {formatCompactIDR(Math.max(filters.salaryMax, filters.salaryMin + IDR_SALARY_RANGES.step))}
                            </span>
                        </div>

                        {/* Quick Select Buttons */}
                        <div className="mt-4 space-y-2">
                            <div className="text-xs text-gray-600 font-medium">Pilihan Cepat:</div>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { min: 0, max: 10000000, label: "0-10 Jt" },
                                    { min: 10000000, max: 25000000, label: "10-25 Jt" },
                                    { min: 25000000, max: 50000000, label: "25-50 Jt" },
                                    { min: 0, max: 50000000, label: "Semua" }
                                ].map((range, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            onChange({ 
                                                ...filters, 
                                                salaryMin: range.min,
                                                salaryMax: range.max
                                            });
                                        }}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            
            {/* CSS untuk styling range slider */}
            <style jsx>{`
                .range-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                }

                .range-slider::-webkit-slider-track {
                    background: transparent;
                }

                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }

                .range-slider::-moz-range-track {
                    background: transparent;
                }

                .range-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default JobsFilterSection;

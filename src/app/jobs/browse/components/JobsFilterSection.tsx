"use client";
import React from "react";

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
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <aside className="space-y-6">
                {/* Job Category Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Category</h3>
                    <div className="space-y-2">
                        {[
                            { label: "Software Engineering", count: "(3,924)" },
                            { label: "Data Science", count: "(2,562)" },
                            { label: "Product Management", count: "(1,247)" },
                            { label: "Design", count: "(1,095)" },
                            { label: "Marketing", count: "(755)" },
                        ].map((cat) => (
                            <label key={cat.label} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories.includes(cat.label)}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                categories: filters.categories.includes(cat.label)
                                                    ? filters.categories.filter((x: string) => x !== cat.label)
                                                    : [...filters.categories, cat.label],
                                            })
                                        }
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{cat.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{cat.count}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* Date Posted Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Date Posted</h3>
                    <div className="space-y-2">
                        {["Last 24 hours", "Last 3 days", "Last 7 days", "Anytime"].map((d) => {
                            const count = d === "Anytime" ? "(9,999)" : d === "Last 24 hours" ? "(1,405)" : d === "Last 3 days" ? "(3,205)" : "(5,592)";
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
                                    <span className="text-gray-400 text-xs">{count}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Job Type Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Type</h3>
                    <div className="space-y-2">
                        {[
                            { label: "Full-time", count: "(9,999)" },
                            { label: "Contract", count: "(2,865)" },
                            { label: "Internship", count: "(1,247)" },
                            { label: "Part-time", count: "(755)" },
                            { label: "Temporary", count: "(143)" }
                        ].map((type) => (
                            <label key={type.label} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.types.includes(type.label)}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                types: filters.types.includes(type.label)
                                                    ? filters.types.filter((x: string) => x !== type.label)
                                                    : [...filters.types, type.label],
                                            })
                                        }
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{type.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{type.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Languages/Tools Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Languages</h3>
                    <div className="space-y-2">
                        {[
                            { label: "English", count: "(6,739)" },
                            { label: "Italian", count: "(1,249)" },
                            { label: "Spanish", count: "(1,028)" },
                            { label: "Indonesian", count: "(703)" },
                            { label: "Turkish", count: "(456)" }
                        ].map((lang) => (
                            <label key={lang.label} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.tools.includes(lang.label)}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                tools: filters.tools.includes(lang.label)
                                                    ? filters.tools.filter((x: string) => x !== lang.label)
                                                    : [...filters.tools, lang.label],
                                            })
                                        }
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{lang.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{lang.count}</span>
                            </label>
                        ))}
                    </div>
                    <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                        +15 more
                    </button>
                </div>

                {/* Location Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Location</h3>
                    <div className="space-y-2">
                        {[
                            { label: "United States", count: "(4,239)" },
                            { label: "United Kingdom", count: "(1,119)" },
                            { label: "Canada", count: "(1,020)" },
                            { label: "Germany", count: "(923)" },
                            { label: "India", count: "(362)" },
                            { label: "Spain", count: "(279)" }
                        ].map((loc) => (
                            <label key={loc.label} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.location.includes(loc.label)}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                location: filters.location.includes(loc.label)
                                                    ? filters.location.filter((x: string) => x !== loc.label)
                                                    : [...filters.location, loc.label],
                                            })
                                        }
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{loc.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{loc.count}</span>
                            </label>
                        ))}
                    </div>
                    <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                        +68 more
                    </button>
                </div>

                {/* Tools Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Tools</h3>
                    <div className="space-y-2">
                        {[
                            { label: "Microsoft Word", count: "(2,976)" },
                            { label: "Microsoft Excel", count: "(3,163)" },
                            { label: "Figma", count: "(2,090)" },
                            { label: "Canva", count: "(1,006)" },
                            { label: "Photoshop", count: "(859)" },
                            { label: "Illustrator", count: "(388)" }
                        ].map((tool) => (
                            <label key={tool.label} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.tools.includes(tool.label)}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                tools: filters.tools.includes(tool.label)
                                                    ? filters.tools.filter((x: string) => x !== tool.label)
                                                    : [...filters.tools, tool.label],
                                            })
                                        }
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{tool.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{tool.count}</span>
                            </label>
                        ))}
                    </div>
                    <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                        +10 more
                    </button>
                </div>

                {/* Salary Range */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-900">Salary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Min. Salary</span>
                            <span>Max. Salary</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span>$4,000</span>
                            <span>$10,000</span>
                        </div>
                        <div className="relative">
                            <input
                                type="range"
                                min="4000"
                                max="10000"
                                value={filters.salaryMin}
                                onChange={(e) => onChange({ ...filters, salaryMin: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${((filters.salaryMin - 4000) / (10000 - 4000)) * 100}%, #4f46e5 ${((filters.salaryMin - 4000) / (10000 - 4000)) * 100}%, #4f46e5 100%)`
                                }}
                            />
                        </div>
                        <div className="text-center">
                            <span className="text-xs text-gray-500">$0 - $5,000</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default JobsFilterSection;

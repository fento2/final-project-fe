import React from "react";

interface JobTypeFilterProps {
    types: string[];
    stats: Record<string, number>;
    loading: boolean;
    onChange: (types: string[]) => void;
}

export const JobTypeFilter: React.FC<JobTypeFilterProps> = ({ 
    types, 
    stats, 
    loading, 
    onChange 
}) => {
    const handleTypeChange = (jobType: string) => {
        const newTypes = types.includes(jobType)
            ? types.filter((x: string) => x !== jobType)
            : [...types, jobType];
        onChange(newTypes);
    };

    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Type</h3>
            <div className="space-y-2">
                {loading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                    Object.entries(stats)
                        .sort(([, a], [, b]) => b - a) // Sort by count descending
                        .map(([jobType, count]) => (
                            <label 
                                key={jobType} 
                                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={types.includes(jobType)}
                                        onChange={() => handleTypeChange(jobType)}
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
    );
};
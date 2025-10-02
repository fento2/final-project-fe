import React from "react";

interface SortFilterProps {
    sortBy: string;
    sortOrder: string;
    onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ sortBy, sortOrder, onChange }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Sort By</h3>
            <div className="space-y-2">
                <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                        const [newSortBy, newSortOrder] = e.target.value.split('-');
                        onChange(newSortBy, newSortOrder as 'asc' | 'desc');
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="salary-desc">Highest Salary</option>
                    <option value="salary-asc">Lowest Salary</option>
                </select>
            </div>
        </div>
    );
};
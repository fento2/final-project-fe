import React from "react";
import { Search } from "lucide-react";

interface TitleSearchFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const TitleSearchFilter: React.FC<TitleSearchFilterProps> = ({ value, onChange }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Search by Title</h3>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>
        </div>
    );
};
import React from "react";

interface PopularSearchItem {
    value: string;
    count?: number;
}

interface PopularSearchesProps {
    popularSearches: PopularSearchItem[];
    onSearchClick: (searchKeyword: string) => void;
}

const defaultSearches = [
    "Software Developer",
    "UI/UX Designer", 
    "Digital Marketing",
    "Data Analyst"
];

export const PopularSearches: React.FC<PopularSearchesProps> = ({ 
    popularSearches, 
    onSearchClick 
}) => {
    const searches: PopularSearchItem[] = popularSearches.length > 0 ? popularSearches : 
        defaultSearches.map(search => ({ value: search }));

    return (
        <div className="text-center w-full">
            <span className="font-semibold text-base text-[#18181B]">Popular Keywords:</span>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
                {searches.map((search, index) => (
                    <span 
                        key={index}
                        onClick={() => onSearchClick(search.value)}
                        className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
                    >
                        {search.value}
                        {search.count && (
                            <span className="ml-1 text-xs text-gray-500">
                                ({search.count})
                            </span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
};
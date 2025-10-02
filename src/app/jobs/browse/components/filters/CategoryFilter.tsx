import React from "react";

interface CategoryFilterProps {
    categories: string[];
    stats: Record<string, number>;
    loading: boolean;
    onChange: (categories: string[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
    categories, 
    stats, 
    loading, 
    onChange 
}) => {
    const handleCategoryChange = (category: string) => {
        const newCategories = categories.includes(category)
            ? categories.filter((x: string) => x !== category)
            : [...categories, category];
        onChange(newCategories);
    };

    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Job Category</h3>
            <div className="space-y-2">
                {loading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                    Object.entries(stats)
                        .sort(([, a], [, b]) => b - a) // Sort by count descending
                        .map(([category, count]) => (
                            <label 
                                key={category} 
                                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={categories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
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
    );
};
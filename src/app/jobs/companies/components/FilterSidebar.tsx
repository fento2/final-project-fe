import { Button } from "../../../../components/ui/button";
import { Star, Users } from "lucide-react";

interface FilterSidebarProps {
    selectedIndustry: string;
    selectedLocation: string;
    uniqueIndustries: string[];
    uniqueLocations: string[];
    onIndustryChange: (industry: string) => void;
    onLocationChange: (location: string) => void;
    onClearFilters: () => void;
    companiesData: any[];
}

export function FilterSidebar({
    selectedIndustry,
    selectedLocation,
    uniqueIndustries,
    uniqueLocations,
    onIndustryChange,
    onLocationChange,
    onClearFilters,
    companiesData,
}: FilterSidebarProps) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-0 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="font-bold text-gray-800 text-base sm:text-lg">Filters</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm"
                >
                    Clear All
                </Button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
                {/* Industry Filter */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Industry</h3>
                    <div className="space-y-2">
                        {uniqueIndustries.map((industry) => (
                            <label key={industry} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="industry"
                                    className="accent-indigo-600"
                                    checked={selectedIndustry === industry}
                                    onChange={() => onIndustryChange(
                                        selectedIndustry === industry ? "" : industry
                                    )}
                                />
                                <span className="text-sm text-gray-600">{industry}</span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    ({companiesData.filter(c => c.industry === industry).length})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Location</h3>
                    <div className="space-y-2">
                        {uniqueLocations.slice(0, 5).map((location) => (
                            <label key={location} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="location"
                                    className="accent-indigo-600"
                                    checked={selectedLocation === location}
                                    onChange={() => onLocationChange(
                                        selectedLocation === location ? "" : location
                                    )}
                                />
                                <span className="text-sm text-gray-600">{location}</span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    ({companiesData.filter(c => c.location.includes(location)).length})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Company Size */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Company Size</h3>
                    <div className="space-y-2">
                        {[
                            { label: "Startup (1-50)", range: [1, 50] },
                            { label: "Small (51-200)", range: [51, 200] },
                            { label: "Medium (201-1000)", range: [201, 1000] },
                            { label: "Large (1000+)", range: [1000, 10000] },
                        ].map(({ label, range }) => (
                            <label key={label} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-indigo-600" />
                                <span className="text-sm text-gray-600">{label}</span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    ({companiesData.filter(c => c.employees >= range[0] && c.employees <= range[1]).length})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Rating</h3>
                    <div className="space-y-2">
                        {[5, 4, 3].map((rating) => (
                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-indigo-600" />
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400 ml-auto">
                                    ({companiesData.filter(c => c.rating >= rating).length})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

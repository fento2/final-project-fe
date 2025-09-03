import { Button } from "../../../../components/ui/button";
import { Search, Filter, Grid, List } from "lucide-react";

interface SearchBarProps {
    searchTerm: string;
    selectedIndustry: string;
    selectedLocation: string;
    uniqueIndustries: string[];
    uniqueLocations: string[];
    sortBy: string;
    viewMode: 'grid' | 'list';
    filteredCount: number;
    showFilters: boolean;
    onSearchChange: (value: string) => void;
    onIndustryChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onToggleFilters: () => void;
    onSearch: () => void;
}

export function SearchBar({
    searchTerm,
    selectedIndustry,
    selectedLocation,
    uniqueIndustries,
    uniqueLocations,
    sortBy,
    viewMode,
    filteredCount,
    showFilters,
    onSearchChange,
    onIndustryChange,
    onLocationChange,
    onSortChange,
    onViewModeChange,
    onToggleFilters,
    onSearch,
}: SearchBarProps) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-0 mb-6 sm:mb-8">
            {/* Search Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies, industries, or keywords..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-sm sm:text-base"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <select
                        value={selectedIndustry}
                        onChange={(e) => onIndustryChange(e.target.value)}
                        className="px-3 sm:px-4 py-3 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base min-w-0 sm:min-w-[140px]"
                    >
                        <option value="">All Industries</option>
                        {uniqueIndustries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                    <select
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="px-3 sm:px-4 py-3 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base min-w-0 sm:min-w-[140px]"
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                    <Button
                        onClick={onSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base whitespace-nowrap"
                    >
                        <Search className="w-4 h-4" /> 
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden">Go</span>
                    </Button>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <Button
                        variant="ghost"
                        onClick={onToggleFilters}
                        className="lg:hidden flex items-center gap-2 text-sm"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden xs:inline">Filters</span>
                    </Button>
                    <div className="text-xs sm:text-sm text-gray-600">
                        <span className="font-semibold">{filteredCount}</span> companies found
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-w-0"
                    >
                        <option value="name">Name</option>
                        <option value="employees">Size</option>
                        <option value="jobs">Jobs</option>
                        <option value="rating">Rating</option>
                        <option value="growth">Growth</option>
                    </select>

                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className="rounded-md p-1.5 sm:p-2"
                        >
                            <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            className="rounded-md p-1.5 sm:p-2"
                        >
                            <List className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

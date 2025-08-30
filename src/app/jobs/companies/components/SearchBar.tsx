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
        <div className="bg-white rounded-2xl p-6 shadow-sm border-0 mb-8">
            {/* Search Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies, industries, or keywords..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                </div>
                <select
                    value={selectedIndustry}
                    onChange={(e) => onIndustryChange(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                    <option value="">All Industries</option>
                    {uniqueIndustries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>
                <select
                    value={selectedLocation}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
                <Button
                    onClick={onSearch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
                >
                    <Search className="w-4 h-4" /> Search
                </Button>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onToggleFilters}
                        className="lg:hidden flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">{filteredCount}</span> companies found
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="employees">Sort by Size</option>
                        <option value="jobs">Sort by Open Jobs</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="growth">Sort by Growth</option>
                    </select>

                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className="rounded-md"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            className="rounded-md"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

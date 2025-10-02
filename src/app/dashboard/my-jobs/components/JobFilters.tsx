interface JobFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    filterJobStatus: string;
    setFilterJobStatus: (value: string) => void;
}

export function JobFilters({ search, setSearch, filterJobStatus, setFilterJobStatus }: JobFiltersProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <select 
                className="border rounded-lg px-3 py-2" 
                value={filterJobStatus} 
                onChange={(e) => setFilterJobStatus(e.target.value)}
            >
                <option value="All">All jobs</option>
                <option value="Current">Current</option>
                <option value="Past">Past</option>
            </select>

            <input
                type="text"
                placeholder="Search job or company"
                className="border rounded-lg px-3 py-2 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}
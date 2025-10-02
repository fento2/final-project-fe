"use client";
import React from "react";
import { useFilterStats } from "@/hooks/useFilterStats";
import { TitleSearchFilter } from "./filters/TitleSearchFilter";
import { SortFilter } from "./filters/SortFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { DateFilter } from "./filters/DateFilter";
import { JobTypeFilter } from "./filters/JobTypeFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { SalaryRangeFilter } from "./filters/SalaryRangeFilter";

export type Filters = {
    title?: string;
    date: string;
    dateFrom?: string;
    dateTo?: string;
    types: string[];
    location: string[];
    categories: string[];
    salaryMin: number;
    salaryMax: number;
    tools?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

interface JobsFilterSectionProps {
    filters: Filters;
    onChange: React.Dispatch<React.SetStateAction<Filters>>;
}

const JobsFilterSection: React.FC<JobsFilterSectionProps> = ({ filters, onChange }) => {
    const { stats, loading: statsLoading } = useFilterStats();

    const handleTitleChange = (title: string) => {
        onChange({ ...filters, title });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        onChange({ ...filters, sortBy, sortOrder });
    };

    const handleCategoriesChange = (categories: string[]) => {
        onChange({ ...filters, categories });
    };

    const handleDateChange = (date: string, dateFrom?: string, dateTo?: string) => {
        onChange({ ...filters, date, dateFrom, dateTo });
    };

    const handleTypesChange = (types: string[]) => {
        onChange({ ...filters, types });
    };

    const handleLocationChange = (location: string[]) => {
        onChange({ ...filters, location });
    };

    const handleSalaryChange = (salaryMin: number, salaryMax: number) => {
        onChange({ ...filters, salaryMin, salaryMax });
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <aside className="space-y-6">
                <TitleSearchFilter
                    value={filters.title || ""}
                    onChange={handleTitleChange}
                />

                <SortFilter
                    sortBy={filters.sortBy || "date"}
                    sortOrder={filters.sortOrder || "desc"}
                    onChange={handleSortChange}
                />

                <CategoryFilter
                    categories={filters.categories}
                    stats={stats.categories}
                    loading={statsLoading}
                    onChange={handleCategoriesChange}
                />

                <DateFilter
                    date={filters.date}
                    dateFrom={filters.dateFrom}
                    dateTo={filters.dateTo}
                    stats={stats.datePosted}
                    loading={statsLoading}
                    onChange={handleDateChange}
                />

                <JobTypeFilter
                    types={filters.types}
                    stats={stats.jobTypes}
                    loading={statsLoading}
                    onChange={handleTypesChange}
                />

                <LocationFilter
                    location={filters.location}
                    stats={stats.locations}
                    loading={statsLoading}
                    onChange={handleLocationChange}
                />

                <SalaryRangeFilter
                    salaryMin={filters.salaryMin}
                    salaryMax={filters.salaryMax}
                    onChange={handleSalaryChange}
                />
            </aside>
        </div>
    );
};

export default JobsFilterSection;
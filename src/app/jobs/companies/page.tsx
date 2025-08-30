"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingCards } from "../../../components/ui/loading";

// Components
import { HeaderSection } from "./components/HeaderSection";
import { FilterSidebar } from "./components/FilterSidebar";
import { SearchBar } from "./components/SearchBar";
import { CompanyCard } from "./components/CompanyCard";
import { CompanyListItem } from "./components/CompanyListItem";
import { Pagination } from "./components/Pagination";
import { EmptyState } from "./components/EmptyState";
import { CTASection } from "./components/CTASection";

// Data and hooks
import { companiesData } from "./data/companiesData";
import { useCompaniesPage } from "./hooks/useCompaniesPage";

export default function CompaniesPage() {
    const {
        // State
        searchTerm,
        selectedIndustry,
        selectedLocation,
        page,
        viewMode,
        sortBy,
        isLoading,
        showFilters,
        
        // Computed values
        currentCompanies,
        totalPages,
        uniqueIndustries,
        uniqueLocations,
        filteredCompanies,
        
        // Actions
        setSearchTerm,
        setSelectedIndustry,
        setSelectedLocation,
        setPage,
        setViewMode,
        setSortBy,
        setShowFilters,
        handleSearch,
        clearFilters,
        handleViewJobs,
        handleViewProfile,
    } = useCompaniesPage(companiesData);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header Section */}
            <HeaderSection
                title="Discover Top Companies Hiring"
                subtitle="Explore amazing companies and find your perfect workplace. From startups to enterprises, discover opportunities that match your career goals."
                breadcrumb={["Home", "Jobs", "Companies"]}
            />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <FilterSidebar
                            selectedIndustry={selectedIndustry}
                            selectedLocation={selectedLocation}
                            uniqueIndustries={uniqueIndustries}
                            uniqueLocations={uniqueLocations}
                            onIndustryChange={setSelectedIndustry}
                            onLocationChange={setSelectedLocation}
                            onClearFilters={clearFilters}
                            companiesData={companiesData}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-1 lg:col-span-4">
                        {/* Search Bar & Controls */}
                        <SearchBar
                            searchTerm={searchTerm}
                            selectedIndustry={selectedIndustry}
                            selectedLocation={selectedLocation}
                            uniqueIndustries={uniqueIndustries}
                            uniqueLocations={uniqueLocations}
                            sortBy={sortBy}
                            viewMode={viewMode}
                            filteredCount={filteredCompanies.length}
                            showFilters={showFilters}
                            onSearchChange={setSearchTerm}
                            onIndustryChange={setSelectedIndustry}
                            onLocationChange={setSelectedLocation}
                            onSortChange={setSortBy}
                            onViewModeChange={setViewMode}
                            onToggleFilters={() => setShowFilters(!showFilters)}
                            onSearch={handleSearch}
                        />

                        {/* Loading State */}
                        {isLoading && <LoadingCards />}

                        {/* Companies Grid/List */}
                        {!isLoading && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {currentCompanies.map((company) => (
                                                <CompanyCard
                                                    key={company.id}
                                                    company={company}
                                                    onViewJobs={handleViewJobs}
                                                    onViewProfile={handleViewProfile}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {currentCompanies.map((company) => (
                                                <CompanyListItem
                                                    key={company.id}
                                                    company={company}
                                                    onViewJobs={handleViewJobs}
                                                    onViewProfile={handleViewProfile}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* No Results */}
                        {!isLoading && filteredCompanies.length === 0 && (
                            <EmptyState onClearFilters={clearFilters} />
                        )}

                        {/* Pagination */}
                        {!isLoading && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}

                        {/* CTA Section */}
                        <CTASection />
                    </main>
                </div>
            </div>
        </div>
    );
}

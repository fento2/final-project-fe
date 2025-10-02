"use client";
import React from "react";
import { Company } from "@/types/userCompany";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompaniesGridSectionProps {
    companies: Company[];
    loading: boolean;
    totalCompanies?: number;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    itemsPerPage?: number;
}

const CompaniesGridSection: React.FC<CompaniesGridSectionProps> = ({
    companies,
    loading,
    totalCompanies = 0,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 9
}) => {
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
                    <div className="text-sm text-gray-500">Loading...</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Loading skeletons */}
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg border shadow-sm p-6 animate-pulse h-80">
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (companies.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
                    <div className="text-sm text-gray-500">0 companies found</div>
                </div>
                
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No companies found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                        We couldn't find any companies matching your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Check your spelling</li>
                            <li>• Try different keywords</li>
                            <li>• Clear all filters</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
                <div className="text-sm text-gray-500">
                    {totalCompanies > 0 ? (
                        totalPages > 1 ? 
                            `${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalCompanies)} of ${totalCompanies} companies` 
                            : `${totalCompanies} ${totalCompanies === 1 ? 'company' : 'companies'} found`
                    ) : (
                        `${companies.length} ${companies.length === 1 ? 'company' : 'companies'} found`
                    )}
                </div>
            </div>

            {/* Pagination at the top - only show if more than 9 companies total */}
            {totalCompanies > 9 && totalPages > 1 && onPageChange && (
                <div className="pb-4 border-b border-gray-200">
                    {/* Mobile Pagination */}
                    <div className="flex flex-col gap-4 sm:hidden">
                        <div className="text-sm text-gray-600 text-center">
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 max-w-full">
                            <Button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 px-2 min-w-0 flex-shrink-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {/* Show only current page and adjacent pages on mobile */}
                            <div className="flex items-center gap-1 overflow-hidden">
                                {currentPage > 2 && (
                                    <>
                                        <Button
                                            onClick={() => onPageChange(1)}
                                            variant="outline"
                                            size="sm"
                                            className="w-8 h-8 p-0 text-xs flex-shrink-0"
                                        >
                                            1
                                        </Button>
                                        {currentPage > 3 && (
                                            <span className="text-gray-400 px-1 text-xs">...</span>
                                        )}
                                    </>
                                )}
                                
                                {currentPage > 1 && (
                                    <Button
                                        onClick={() => onPageChange(currentPage - 1)}
                                        variant="outline"
                                        size="sm"
                                        className="w-8 h-8 p-0 text-xs flex-shrink-0"
                                    >
                                        {currentPage - 1}
                                    </Button>
                                )}
                                
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-8 h-8 p-0 text-xs flex-shrink-0"
                                >
                                    {currentPage}
                                </Button>
                                
                                {currentPage < totalPages && (
                                    <Button
                                        onClick={() => onPageChange(currentPage + 1)}
                                        variant="outline"
                                        size="sm"
                                        className="w-8 h-8 p-0 text-xs flex-shrink-0"
                                    >
                                        {currentPage + 1}
                                    </Button>
                                )}
                                
                                {currentPage < totalPages - 1 && (
                                    <>
                                        {currentPage < totalPages - 2 && (
                                            <span className="text-gray-400 px-1 text-xs">...</span>
                                        )}
                                        <Button
                                            onClick={() => onPageChange(totalPages)}
                                            variant="outline"
                                            size="sm"
                                            className="w-8 h-8 p-0 text-xs flex-shrink-0"
                                        >
                                            {totalPages}
                                        </Button>
                                    </>
                                )}
                            </div>

                            <Button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 px-2 min-w-0 flex-shrink-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Pagination */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else {
                                        const start = Math.max(1, currentPage - 2);
                                        const end = Math.min(totalPages, start + 4);
                                        pageNumber = start + i;
                                        if (pageNumber > end) return null;
                                    }

                                    return (
                                        <Button
                                            key={pageNumber}
                                            onClick={() => onPageChange(pageNumber)}
                                            variant={pageNumber === currentPage ? "default" : "outline"}
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {companies.map((company, index) => (
                    <CompanyCard 
                        key={company.company_id || index} 
                        company={company} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CompaniesGridSection;
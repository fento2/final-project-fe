"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BrowseHeroSection from "./components/BrowseHeroSection";
import JobsFilterSection, { Filters } from "./components/JobsFilterSection";
import JobsGridSection from "./components/JobsGridSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import BrowseTestimonialSection from "./components/BrowseTestimonialSection";
import BrowseCTASection from "./components/BrowseCTASection";

export default function Page() {
	const searchParams = useSearchParams();
	const [filters, setFilters] = useState<Filters>({
		date: "Anytime",
		types: [],
		tools: [],
		location: [],
		categories: [],
		salaryMin: 0, // Rp 0
		salaryMax: 50000000, // 50 juta IDR
	});

	// Set initial filters from URL parameters
	useEffect(() => {
		const categoriesParam = searchParams.get("categories");
		const queryParam = searchParams.get("query");
		const locationParam = searchParams.get("location");
		const typeParam = searchParams.get("type");

		if (categoriesParam || queryParam || locationParam || typeParam) {
			setFilters(prev => ({
				...prev,
				categories: categoriesParam ? [categoriesParam] : prev.categories,
				// You can add more URL parameter handling here if needed
			}));
		}
	}, [searchParams]);

	// Function to clear individual filters
	const handleClearFilter = (filterType: string, value: string) => {
		setFilters(prev => {
			if (filterType === 'categories') {
				return {
					...prev,
					categories: prev.categories.filter(item => item !== value)
				};
			} else if (filterType === 'types') {
				return {
					...prev,
					types: prev.types.filter(item => item !== value)
				};
			} else if (filterType === 'location') {
				return {
					...prev,
					location: prev.location.filter(item => item !== value)
				};
			} else if (filterType === 'tools') {
				return {
					...prev,
					tools: prev.tools.filter(item => item !== value)
				};
			}
			return prev;
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero */}
			<BrowseHeroSection filters={filters} onClearFilter={handleClearFilter} />

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Filters Sidebar */}
					<div className="lg:col-span-1">
						<JobsFilterSection filters={filters} onChange={setFilters} />
					</div>

					{/* Jobs Grid */}
					<div className="lg:col-span-3">
						<JobsGridSection filters={filters} />
					</div>
				</div>
			</div>

			{/* Extra Sections */}
			<div className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<HowItWorksSection />
				</div>
			</div>

			<div className="bg-gray-50">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
						<BrowseTestimonialSection />
					</div>
			</div>

			<div className="bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
						<BrowseCTASection />
					</div>
			</div>
		</div>
	);
}


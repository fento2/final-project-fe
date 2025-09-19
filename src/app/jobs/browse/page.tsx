"use client";
import React, { useState } from "react";
import BrowseHeroSection from "./components/BrowseHeroSection";
import JobsFilterSection, { Filters } from "./components/JobsFilterSection";
import JobsGridSection from "./components/JobsGridSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import BrowseTestimonialSection from "./components/BrowseTestimonialSection";
import BrowseCTASection from "./components/BrowseCTASection";

export default function Page() {
	const [filters, setFilters] = useState<Filters>({
		date: "Anytime",
		types: [],
		tools: [],
		location: [],
		categories: [],
		salaryMin: 4000,
		salaryMax: 0,
	});

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero */}
			<BrowseHeroSection />

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


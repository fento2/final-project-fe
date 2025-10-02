"use client";
import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BrowseHeroSection from "./components/BrowseHeroSection";
import JobsFilterSection, { Filters } from "./components/JobsFilterSection";
import JobsGridSection from "./components/JobsGridSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import BrowseTestimonialSection from "./components/BrowseTestimonialSection";
import BrowseCTASection from "./components/BrowseCTASection";

function BrowsePageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [filters, setFilters] = useState<Filters>({
		title: "",
		date: "Anytime",
		dateFrom: "",
		dateTo: "",
		types: [],
		location: [],
		categories: [],
		salaryMin: 0, // Rp 0
		salaryMax: 200000000, // 200 juta IDR
		sortBy: "date",
		sortOrder: "desc"
	});

	// Set initial filters from URL parameters
	useEffect(() => {
		const categoriesParam = searchParams.getAll("categories");
		const locationParam = searchParams.getAll("location");
		const typesParam = searchParams.getAll("type");
		const titleParam = searchParams.get("title");
		const dateParam = searchParams.get("date");
		const dateFromParam = searchParams.get("dateFrom");
		const dateToParam = searchParams.get("dateTo");
		const salaryMinParam = searchParams.get("salaryMin");
		const salaryMaxParam = searchParams.get("salaryMax");
		const sortByParam = searchParams.get("sortBy");
		const sortOrderParam = searchParams.get("sortOrder");

		setFilters(prev => ({
			...prev,
			title: titleParam || prev.title,
			categories: categoriesParam.length ? categoriesParam : prev.categories,
			location: locationParam.length ? locationParam : prev.location,
			types: typesParam.length ? typesParam : prev.types,
			date: dateParam || prev.date,
			dateFrom: dateFromParam || prev.dateFrom,
			dateTo: dateToParam || prev.dateTo,
			salaryMin: salaryMinParam ? parseInt(salaryMinParam) : prev.salaryMin,
			salaryMax: salaryMaxParam ? parseInt(salaryMaxParam) : prev.salaryMax,
			sortBy: sortByParam || prev.sortBy,
			sortOrder: (sortOrderParam as 'asc' | 'desc') || prev.sortOrder,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync filters to URL
	useEffect(() => {
		const params = new URLSearchParams();
		filters.categories.forEach(c => params.append('categories', c));
		filters.location.forEach(l => params.append('location', l));
		filters.types.forEach(t => params.append('type', t));
		if (filters.title && filters.title.trim()) params.set('title', filters.title);
		if (filters.date && filters.date !== 'Anytime') params.set('date', filters.date);
		if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
		if (filters.dateTo) params.set('dateTo', filters.dateTo);
		if (typeof filters.salaryMin === 'number') params.set('salaryMin', String(filters.salaryMin));
		if (typeof filters.salaryMax === 'number') params.set('salaryMax', String(filters.salaryMax));
		if (filters.sortBy) params.set('sortBy', filters.sortBy);
		if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [filters, pathname, router]);

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
			}
			return prev;
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero */}
			<BrowseHeroSection filters={filters} onClearFilter={handleClearFilter} onChange={setFilters} />

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

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BrowsePageContent />
		</Suspense>
	);
}


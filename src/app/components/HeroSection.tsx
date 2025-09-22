
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useSearchSuggestions, usePopularSearches, SearchSuggestion } from "@/hooks/useSearchSuggestions";
import SuggestionDropdown from "@/components/ui/SuggestionDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/zustand/authStore";

const HeroSection = () => {
	const router = useRouter();
	const { user, loading } = useAuth();
	const [keyword, setKeyword] = useState("");
	const [location, setLocation] = useState("");
	
	// Suggestion states
	const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
	const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
	const [selectedKeywordIndex, setSelectedKeywordIndex] = useState(-1);
	const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
	const keywordRef = useRef<HTMLDivElement>(null);
	const locationRef = useRef<HTMLDivElement>(null);

	// Hooks for suggestions
	const { suggestions: keywordSuggestions } = useSearchSuggestions(keyword, 'all');
	const { suggestions: locationSuggestions } = useSearchSuggestions(location, 'location');
	const { popularSearches } = usePopularSearches();
	const { role: storeRole, isLogin: storeIsLogin } = useAuthStore();

	// Check if user is a company
	const isCompanyUser = () => {
		// Prefer immediate feedback from client store when available
		if (storeIsLogin && (storeRole || '').toUpperCase() === 'COMPANY') return true;
		// Fallback to API-backed auth hook
		if (loading) return false;
		if (!user) return false;
		return user.role === 'COMPANY';
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (keywordRef.current && !keywordRef.current.contains(event.target as Node)) {
				setShowKeywordSuggestions(false);
			}
			if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
				setShowLocationSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setShowKeywordSuggestions(false);
		setShowLocationSuggestions(false);
		const q = `query=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
		router.push(`/?${q}`);
	};

	const handlePopularSearchClick = (searchKeyword: string) => {
		setKeyword(searchKeyword);
		const q = `query=${encodeURIComponent(searchKeyword)}&location=${encodeURIComponent(location)}`;
		router.push(`/?${q}`);
	};

	const handleSuggestionSelect = (suggestion: SearchSuggestion, field: 'keyword' | 'location') => {
		if (field === 'keyword') {
			// Handle berdasarkan tipe suggestion
			if (suggestion.type === 'location') {
				// Jika location, masukkan ke location field dan clear keyword
				setLocation(suggestion.value);
				setKeyword('');
			} else {
				// Jika keyword biasa (category, title, company), tetap di keyword field
				setKeyword(suggestion.value);
			}
			setShowKeywordSuggestions(false);
			setSelectedKeywordIndex(-1);
		} else if (field === 'location') {
			// Untuk location field, hanya terima suggestion bertipe location
			if (suggestion.type === 'location') {
				setLocation(suggestion.value);
			} else {
				// Fallback: masukkan ke location field anyway
				setLocation(suggestion.value);
			}
			setShowLocationSuggestions(false);
			setSelectedLocationIndex(-1);
		}
	};

	const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
		if (!showKeywordSuggestions || keywordSuggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedKeywordIndex(prev => 
					prev < keywordSuggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedKeywordIndex(prev => 
					prev > 0 ? prev - 1 : keywordSuggestions.length - 1
				);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedKeywordIndex >= 0) {
					handleSuggestionSelect(keywordSuggestions[selectedKeywordIndex], 'keyword');
				}
				break;
			case 'Escape':
				setShowKeywordSuggestions(false);
				setSelectedKeywordIndex(-1);
				break;
		}
	};

	const handleLocationKeyDown = (e: React.KeyboardEvent) => {
		if (!showLocationSuggestions || locationSuggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedLocationIndex(prev => 
					prev < locationSuggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedLocationIndex(prev => 
					prev > 0 ? prev - 1 : locationSuggestions.length - 1
				);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedLocationIndex >= 0) {
					handleSuggestionSelect(locationSuggestions[selectedLocationIndex], 'location');
				}
				break;
			case 'Escape':
				setShowLocationSuggestions(false);
				setSelectedLocationIndex(-1);
				break;
		}
	};
	return (
			<section className="w-screen min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center bg-white -mt-6 md:-mt-12">
			<div
				className="relative max-w-[1200px] w-full flex flex-col items-center rounded-[32px] md:rounded-[48px] overflow-hidden shadow-lg bg-white md:scale-[1.15] min-h-[520px] md:min-h-[700px] lg:min-h-[700px]"
			>
				{/* Background image */}
				<img
					src="/images/bg_hero.jpg"
					alt="hero background"
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>
				{/* Overlay for soft white effect*/}
				<div className="absolute inset-0 bg-white/20 z-10" />

				<div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<span className="block text-center text-base font-semibold text-[#4F46E5] mb-6">The Only Job Marketplace</span>
					<h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#18181B] mb-4 leading-tight">
						{isCompanyUser() ? (
							<>Find the best employees<br />with us</>
						) : (
							<>Find Your Dream<br />Job with Us</>
						)}
					</h1>
					<p className="text-center text-base sm:text-lg text-[#52525B] mb-8 max-w-2xl px-2">
						{isCompanyUser() 
							? "Connect with top talent and build your dream team with Horizon Jobs, the premier recruitment platform for employers."
							: "Discover your next career move with Horizon Jobs, the go-to job marketplace for job seekers and employers."
						}
					</p>
					<form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center w-full max-w-5xl gap-3 sm:gap-4 mb-8 px-2">
						{/* Keyword Search with Suggestions */}
						<div ref={keywordRef} className="relative w-full md:w-[520px]">
							<div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full border border-gray-200">
								<Search className="w-5 h-5 text-gray-400 mr-2" />
								<input
									type="text"
									placeholder="What job are you looking for?"
									value={keyword}
									onChange={(e) => {
										setKeyword(e.target.value);
										setShowKeywordSuggestions(true);
										setSelectedKeywordIndex(-1);
									}}
									onFocus={() => setShowKeywordSuggestions(true)}
									onKeyDown={handleKeywordKeyDown}
									className="w-full outline-none bg-transparent text-sm sm:text-base"
								/>
							</div>
							<SuggestionDropdown
								suggestions={keywordSuggestions}
								onSelect={(suggestion) => handleSuggestionSelect(suggestion, 'keyword')}
								isVisible={showKeywordSuggestions && keyword.length >= 2}
								selectedIndex={selectedKeywordIndex}
							/>
						</div>

						{/* Location Input with Suggestions */}
						<div ref={locationRef} className="relative w-full md:w-[280px]">
							<div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full border border-gray-200">
								<MapPin className="w-5 h-5 text-gray-400 mr-2" />
								<input
									type="text"
									placeholder="Location (city, country)"
									value={location}
									onChange={(e) => {
										setLocation(e.target.value);
										setShowLocationSuggestions(true);
										setSelectedLocationIndex(-1);
									}}
									onFocus={() => setShowLocationSuggestions(true)}
									onKeyDown={handleLocationKeyDown}
									className="w-full outline-none bg-transparent text-sm sm:text-base"
								/>
							</div>
							<SuggestionDropdown
								suggestions={locationSuggestions}
								onSelect={(suggestion) => handleSuggestionSelect(suggestion, 'location')}
								isVisible={showLocationSuggestions && location.length >= 2}
								selectedIndex={selectedLocationIndex}
							/>
						</div>

						<button
							type="submit"
							className="bg-[#4F46E5] text-white font-semibold rounded-lg px-8 py-2 shadow hover:bg-[#4338CA] transition"
						>
							Search
						</button>
					</form>
					<div className="text-center w-full">
						<span className="font-semibold text-base text-[#18181B]">Popular Keywords:</span>
						<div className="flex flex-wrap justify-center gap-3 mt-2">
							{popularSearches.length > 0 ? (
								popularSearches.map((search, index) => (
									<span 
										key={index}
										onClick={() => handlePopularSearchClick(search.value)}
										className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
									>
										{search.value}
										{search.count && (
											<span className="ml-1 text-xs text-gray-500">
												({search.count})
											</span>
										)}
									</span>
								))
							) : (
								// Fallback popular searches
								<>
									<span 
										onClick={() => handlePopularSearchClick("Software Developer")}
										className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
									>
										Software Developer
									</span>
									<span 
										onClick={() => handlePopularSearchClick("UI/UX Designer")}
										className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
									>
										UI/UX Designer
									</span>
									<span 
										onClick={() => handlePopularSearchClick("Digital Marketing")}
										className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
									>
										Digital Marketing
									</span>
									<span 
										onClick={() => handlePopularSearchClick("Data Analyst")}
										className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
									>
										Data Analyst
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);

};

export default HeroSection;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

const HeroSection = () => {
	const router = useRouter();
	const [keyword, setKeyword] = useState("");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const q = `query=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`;
		router.push(`/search?${q}`);
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

				<div className="relative z-20 flex flex-col items-center w-full px-4 sm:px-6 py-8 sm:py-12">
					<span className="block text-center text-base font-semibold text-[#4F46E5] mb-6">The Only Job Marketplace</span>
					<h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#18181B] mb-4 leading-tight">
						Find Your Dream<br />Job with Us
					</h1>
					<p className="text-center text-base sm:text-lg text-[#52525B] mb-8 max-w-2xl px-2">
						Discover your next career move with Horizon Jobs, the go-to job marketplace for job seekers and employers.
					</p>
					<form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center w-full max-w-3xl gap-3 sm:gap-4 mb-6 px-2">
						<div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-[400px] border border-gray-200">
							<Search className="w-5 h-5 text-gray-400 mr-2" />
							<input
								type="text"
								placeholder="What job are you looking for?"
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								className="w-full outline-none bg-transparent text-sm sm:text-base"
							/>
						</div>
						<div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-[260px] border border-gray-200 relative">
							<select
								aria-label="Category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="w-full bg-transparent border-none text-base outline-none appearance-none pr-8"
							>
								<option value="">Select category</option>
								<option value="Graphic Designer">Graphic Designer</option>
								<option value="UI/UX">UI/UX</option>
								<option value="Web Developer">Web Developer</option>
							</select>
							<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={16} />
						</div>

						<div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-[200px] border border-gray-200">
							<MapPin className="w-5 h-5 text-gray-400 mr-2" />
							<input
								type="text"
								placeholder="Location (city, country)"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								className="w-full outline-none bg-transparent text-sm sm:text-base"
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
						<span className="font-semibold text-base text-[#18181B]">Popular Search:</span>
						<div className="flex flex-wrap justify-center gap-3 mt-2">
							<span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">Graphic Designer</span>
							<span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">UI/UX</span>
							<span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">Web Developer</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

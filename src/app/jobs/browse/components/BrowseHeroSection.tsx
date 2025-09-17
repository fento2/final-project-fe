"use client";
import React from "react";
import Image from "next/image";

const BrowseHeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/bg_hero.jpg" alt="hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <nav className="text-sm text-indigo-600 mb-4">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-2 text-gray-300">/</span>
          <a href="/jobs" className="hover:underline">Jobs</a>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">Browse</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          Browse Through<br />Variety of Jobs
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Find the perfect role from startups to enterprise teams — filter by date, job type, location, tools, and salary to quickly narrow results.
        </p>
      </div>
    </div>
  );
};

export default BrowseHeroSection;

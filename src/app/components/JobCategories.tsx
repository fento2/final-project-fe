"use client";
import { useState } from "react";

const JobCategories = () => {
  const [showAll, setShowAll] = useState(false);

  const categories = [
    {
      label: "Software Engineering",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 3450,
    },
    {
      label: "Data Science",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 2100,
    },
    {
      label: "Customer Service",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1430,
    },
    {
      label: "Product Management",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 980,
    },
    {
      label: "Design",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1250,
    },
    {
      label: "Healthcare",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1920,
    },
    {
      label: "Manufacturing",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1550,
    },
    {
      label: "Marketing",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1670,
    },
    {
      label: "Sales",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 2890,
    },
    {
      label: "Finance",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1190,
    },
    {
      label: "Human Resources",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 870,
    },
    {
      label: "Operations",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 1340,
    },
    {
      label: "Education",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 670,
    },
    {
      label: "Construction",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 820,
    },
    {
      label: "Others",
      Logo: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
      openJobs: 450,
    },
  ];

  const visibleCategories = showAll ? categories : categories.slice(0, 4);

  return (
    <div className="w-full my-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Explore our <br /> Job Categories
        </h1>
        <p className="text-lg text-gray-500">
          Get started by looking at our job categories. Hundreds of new jobs
          everyday!
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12 px-4">
        {visibleCategories.map((cat, i) => (
          <div
            key={i}
            className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Background Image */}
            <img
              src={cat.Logo}
              alt={cat.label}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-4">
              <p className="font-bold text-lg">{cat.label}</p>
              <span className="text-sm">{cat.openJobs} open jobs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 rounded-lg bg-indigo-500 font-medium hover:bg-indigo-700 text-white"
        >
          {showAll ? "See Less" : "See All"}
        </button>
      </div>
    </div>
  );
};

export default JobCategories;

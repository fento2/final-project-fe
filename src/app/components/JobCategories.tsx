"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFilterStats } from "@/hooks/useFilterStats";

const JobCategories = () => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const { stats, loading } = useFilterStats();

  // Create categories from backend data with category-specific images
  const getCategoryImage = (category: string): string => {
    const categoryImages: { [key: string]: string } = {
      "Software Engineering": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", 
      "Product Management": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      "Sales": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      "Customer Service": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop",
      "Finance": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      "Healthcare": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      "Education": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop",
      "Human Resources": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
      "Operations": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
      "Manufacturing": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      "Construction": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
      "Engineering": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop",
      "Research": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
      "Legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
      "Consulting": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      "Technology": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      "Media": "https://images.unsplash.com/photo-1478720568477-b2709344b36a?w=400&h=300&fit=crop",
      "Government": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      "Non-Profit": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      "Retail": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      "Transportation": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
      "Security": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop",
      "Quality Assurance": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      "Business Development": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      "Project Management": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      "DevOps": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop",
      "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
      "Mobile Development": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      "Web Development": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      "UI/UX Design": "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
      "Graphic Design": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop",
    };
    
    // Smart matching for similar categories
    const normalizedCategory = category.toLowerCase();
    
    // Direct match first
    if (categoryImages[category]) {
      return categoryImages[category];
    }
    
    // Fallback matching for variations
    for (const [key, image] of Object.entries(categoryImages)) {
      const normalizedKey = key.toLowerCase();
      if (normalizedCategory.includes(normalizedKey.split(' ')[0]) || 
          normalizedKey.includes(normalizedCategory.split(' ')[0])) {
        return image;
      }
    }
    
    // Default fallback
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop";
  };

  // Convert backend stats to category format
  const categories = Object.entries(stats.categories)
    .sort(([,a], [,b]) => b - a) // Sort by job count descending
    .map(([category, count]) => ({
      label: category,
      Logo: getCategoryImage(category),
      openJobs: count,
    }));

  const visibleCategories = showAll ? categories : categories.slice(0, 4);

  const handleCategoryClick = (categoryLabel: string) => {
    // Navigate to jobs/browse with category filter
    router.push(`/jobs/browse?categories=${encodeURIComponent(categoryLabel)}`);
  };

  return (
    <div className="w-full my-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Explore our <br /> Job Categories
        </h1>
        <p className="text-lg text-gray-500">
          {loading 
            ? "Loading job categories..." 
            : `Get started by looking at our job categories. ${stats.totalJobs > 0 ? `${stats.totalJobs} jobs available!` : 'New jobs everyday!'}`
          }
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12 px-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-56 rounded-xl bg-gray-200 animate-pulse"
            />
          ))
        ) : categories.length === 0 ? (
          // No data message
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No job categories available at the moment.</p>
          </div>
        ) : (
          // Actual categories
          visibleCategories.map((cat, i) => (
            <div
              key={i}
              className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              onClick={() => handleCategoryClick(cat.label)}
            >
              {/* Background Image */}
              <img
                src={cat.Logo}
                alt={`${cat.label} category jobs`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex flex-col justify-center items-center text-center text-white p-4 transition-all duration-300">
                <p className="font-bold text-lg group-hover:text-xl transition-all duration-300">{cat.label}</p>
                <span className="text-sm group-hover:text-base transition-all duration-300">
                  {cat.openJobs} open job{cat.openJobs !== 1 ? 's' : ''}
                </span>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    Click to explore →
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button */}
      {!loading && categories.length > 4 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-lg bg-indigo-500 font-medium hover:bg-indigo-700 text-white transition-colors duration-300"
          >
            {showAll ? "See Less" : `See All (${categories.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCategories;

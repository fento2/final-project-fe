"use client";
import { useState } from "react";
import { TrendingUp, Users, Search, Briefcase, Home, BarChart3 } from "lucide-react";

const categories = [
    {
        id: "job-trends",
        name: "Job Trends",
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    {
        id: "career-development", 
        name: "Career Development",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
    },
    {
        id: "industry-insights",
        name: "Industry Insights", 
        icon: BarChart3,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
    },
    {
        id: "job-search-tips",
        name: "Job Search Tips",
        icon: Search,
        color: "text-orange-600", 
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
    },
    {
        id: "remote-work",
        name: "Remote Work",
        icon: Home,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50", 
        borderColor: "border-indigo-200"
    },
    {
        id: "job-market-analytics",
        name: "Job Market Analytics",
        icon: Briefcase,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-200"
    }
];

export default function CategoryFilter() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Categories</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.id;
                    
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                isSelected 
                                    ? `${category.bgColor} ${category.borderColor} shadow-md` 
                                    : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                    <IconComponent className={`w-5 h-5 ${category.color}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {category.name}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

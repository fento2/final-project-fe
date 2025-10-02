"use client";
import Link from "next/link";
import { FileText, Code, Briefcase } from "lucide-react";

const categories = [
    {
        name: "Job Trends",
        count: 12,
        icon: Briefcase,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        href: "/blog?category=job-trends"
    },
    {
        name: "Career Development", 
        count: 8,
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-green-50",
        href: "/blog?category=career-development"
    },
    {
        name: "Job Search Tips",
        count: 15,
        icon: Code,
        color: "text-purple-600", 
        bgColor: "bg-purple-50",
        href: "/blog?category=job-search-tips"
    }
];

export default function PopularCategories() {
    return (
        <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
            <div className="space-y-3">
                {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                        <Link 
                            key={category.name}
                            href={category.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                <IconComponent className={`w-4 h-4 ${category.color}`} />
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">({category.count})</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

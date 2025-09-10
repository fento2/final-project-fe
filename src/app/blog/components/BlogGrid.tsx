"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
    {
        id: 1,
        title: "10 Tips for Acing Your Next Job Interview",
        excerpt: "Master the art of job interviews with these proven strategies that will help you stand out from other candidates.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
        category: "Career Tips",
        date: "2024-09-08",
        readTime: "5 min read",
        slug: "10-tips-acing-job-interview"
    },
    {
        id: 2,
        title: "Remote Work: The Future of Employment",
        excerpt: "Explore how remote work is reshaping the job market and what it means for both employers and employees.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop",
        category: "Industry Trends",
        date: "2024-09-06",
        readTime: "7 min read",
        slug: "remote-work-future-employment"
    },
    {
        id: 3,
        title: "Building Your Personal Brand on LinkedIn",
        excerpt: "Learn how to create a compelling LinkedIn profile that attracts recruiters and showcases your professional value.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
        category: "Professional Development",
        date: "2024-09-04",
        readTime: "6 min read",
        slug: "building-personal-brand-linkedin"
    },
    {
        id: 4,
        title: "Salary Negotiation: Get What You're Worth",
        excerpt: "Master the art of salary negotiation with these expert tips and strategies for maximizing your earning potential.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
        category: "Career Tips",
        date: "2024-09-02",
        readTime: "8 min read",
        slug: "salary-negotiation-tips"
    },
    {
        id: 5,
        title: "Tech Skills in High Demand for 2024",
        excerpt: "Discover the most sought-after technical skills employers are looking for and how to develop them.",
        image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&h=300&fit=crop",
        category: "Skills Development",
        date: "2024-08-30",
        readTime: "10 min read",
        slug: "tech-skills-high-demand-2024"
    },
    {
        id: 6,
        title: "Work-Life Balance: Myth or Reality?",
        excerpt: "Examining the concept of work-life balance in today's fast-paced world and practical strategies to achieve it.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&h=300&fit=crop",
        category: "Workplace Culture",
        date: "2024-08-28",
        readTime: "6 min read",
        slug: "work-life-balance-myth-reality"
    }
];

const categories = [
    "All",
    "Career Tips",
    "Industry Trends",
    "Professional Development",
    "Skills Development",
    "Workplace Culture",
];

export default function BlogGrid() {
    return (
    <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === "All"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group ring-1 ring-gray-100 hover:ring-indigo-100 hover:-translate-y-0.5 will-change-transform"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {post.title}
                                </h3>
                                
                                <p className="text-gray-600 mb-5 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <Link 
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group"
                                >
                                    Read More
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                        Load More Articles
                    </button>
                </div>
            </div>
        </section>
    );
}

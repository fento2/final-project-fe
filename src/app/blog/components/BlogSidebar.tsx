"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp, Calendar, User } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";

export default function BlogSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPopularPosts();
    }, []);

    const fetchPopularPosts = async () => {
        try {
            const { data } = await apiCall.get('/blog');
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
            
            if (Array.isArray(postsData)) {
                const transformedPosts: BlogPost[] = postsData.slice(0, 4).map((post: any, index: number) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt,
                    image: post.featured_image || getImageForPost(index),
                    category: getCategoryForPost(index),
                    author: {
                        name: getAuthorForPost(index),
                        avatar: getAvatarForPost(index),
                        initials: getAuthorForPost(index).split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    },
                    published_at: new Date(post.created_at),
                    created_at: new Date(post.created_at),
                    updated_at: new Date(post.updated_at),
                    read_time: Math.max(1, Math.ceil(post.content?.split(' ').length / 200)) || 5,
                    status: (post.published ? 'published' : 'draft') as 'published' | 'draft'
                }));
                
                setPopularPosts(transformedPosts);
            }
        } catch (error) {
            console.error('Error fetching popular posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryForPost = (index: number) => {
        const categories = ["Career Development", "Job Search Tips", "Remote Work", "Industry Insights"];
        return categories[index % categories.length];
    };

    const getAuthorForPost = (index: number) => {
        const authors = ["Sarah Johnson", "Michael Chen", "Emily Davis", "David Wilson"];
        return authors[index % authors.length];
    };

    const getImageForPost = (index: number) => {
        const images = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop"
        ];
        return images[index % images.length];
    };

    const getAvatarForPost = (index: number) => {
        const avatars = [
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        ];
        return avatars[index % avatars.length];
    };

    const getTitleForPost = (post: BlogPost, index: number) => {
        const titles = [
            "How to Build Your Personal Brand for Career Success",
            "Remote Work Best Practices in 2024",
            "Networking Strategies That Actually Work",
            "The Complete Guide to Salary Negotiation"
        ];
        return titles[index % titles.length];
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const popularCategories = [
        { name: "Career Development", count: 12, color: "bg-blue-100 text-blue-800" },
        { name: "Job Search Tips", count: 8, color: "bg-green-100 text-green-800" },
        { name: "Remote Work", count: 6, color: "bg-purple-100 text-purple-800" },
        { name: "Industry Insights", count: 10, color: "bg-orange-100 text-orange-800" },
        { name: "Job Trends", count: 7, color: "bg-pink-100 text-pink-800" }
    ];

    return (
        <div className="space-y-8">
            {/* Search Widget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Articles</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search for articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Popular Categories
                </h3>
                <div className="space-y-3">
                    {popularCategories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/blog?category=${category.name.toLowerCase().replace(' ', '-')}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                {category.name}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                {category.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {popularPosts.map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="flex gap-3 group"
                            >
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                    <Image
                                        src={post.image || getImageForPost(index)}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                        {getTitleForPost(post, index)}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(post.published_at)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                    Get the latest career tips and job market insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}

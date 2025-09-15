"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";

export default function FeaturedArticles() {
    const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedPosts();
    }, []);

    const fetchFeaturedPosts = async () => {
        try {
            const { data } = await apiCall.get('/blog');
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
            
            if (Array.isArray(postsData)) {
                // Transform and get first 2 posts as featured
                const transformedPosts: BlogPost[] = postsData.slice(0, 2).map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt,
                    image: post.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
                    category: "Job Trends", // Map to appropriate category
                    author: {
                        name: post.author?.name || post.author?.username || "Admin",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                        initials: (post.author?.name || post.author?.username || "A").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    },
                    published_at: new Date(post.created_at),
                    created_at: new Date(post.created_at),
                    updated_at: new Date(post.updated_at),
                    read_time: Math.max(1, Math.ceil(post.content?.split(' ').length / 200)) || 5,
                    status: (post.published ? 'published' : 'draft') as 'published' | 'draft'
                }));
                
                setFeaturedPosts(transformedPosts);
            }
        } catch (error) {
            console.error('Error fetching featured posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                <Link 
                    href="/blog/all"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                    View All Articles
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post, index) => (
                    <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                        <div className="relative h-48">
                            <Image
                                src={post.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {index === 0 ? "Job Search Tips" : "Job Trends"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                {index === 0 ? "5 Tips for Crafting a Winning Resume" : "The Top 10 In-Demand IT Jobs of 2023"}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {index === 0 
                                    ? "Our advice on how to create the winning resume in your current job application process to impress and compete..."
                                    : "What you think say about the top 10 in-Demand IT Jobs of 2023 from thousands of years of highlighting job market..."
                                }
                            </p>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-medium">{index === 0 ? "Sarah Jones" : "John Smith"}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                                
                                <Link 
                                    href={`/blog/${post.slug}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

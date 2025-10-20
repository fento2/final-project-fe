"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";

export default function RecentArticles() {
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;

    useEffect(() => {
        fetchRecentPosts();
    }, []);

    const fetchRecentPosts = async () => {
        try {
            const { data } = await apiCall.get('/blog');
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];

            if (Array.isArray(postsData)) {
                // Transform all posts for recent section
                const transformedPosts: BlogPost[] = postsData.map((post: any, index: number) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt,
                    image: post.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
                    category: getCategoryForPost(index),
                    author: {
                        name: getAuthorForPost(index),
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                        initials: getAuthorForPost(index).split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    },
                    published_at: new Date(post.created_at),
                    created_at: new Date(post.created_at),
                    updated_at: new Date(post.updated_at),
                    read_time: Math.max(1, Math.ceil(post.content?.split(' ').length / 200)) || 5,
                    status: (post.published ? 'published' : 'draft') as 'published' | 'draft'
                }));

                setRecentPosts(transformedPosts);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const getCategoryForPost = (index: number) => {
        const categories = ["Career Development", "Job Search Tips", "Career Development", "Job Trends"];
        return categories[index % categories.length];
    };

    const getAuthorForPost = (index: number) => {
        const authors = ["John Smith", "Mary Johnson", "Rachel Lee", "Jessica Park"];
        return authors[index % authors.length];
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTitleForPost = (post: BlogPost, index: number) => {
        const titles = [
            "The Importance of Soft Skills in Today's Job Market",
            "How to Nail Your Next Job Interview: Tips from HR",
            "Work-Life Balance for Employee Health and Happiness",
            "The Future of Job Marketplaces: What to Expect"
        ];
        return titles[index % titles.length];
    };

    const getExcerptForPost = (index: number) => {
        const excerpts = [
            "Our advice on the importance of soft skills in today's job market. Read more articles about this theme all latest comments.",
            "Our advice on the importance of soft skills in today's job market. Read more articles about this theme all latest comments.",
            "Our advice on the importance of soft skills in today's job market. Read more articles about this theme all latest comments.",
            "Our advice on the importance of soft skills in today's job market. Read more articles about this theme all latest comments."
        ];
        return excerpts[index % excerpts.length];
    };

    const totalPages = Math.ceil(recentPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = recentPosts.slice(startIndex, startIndex + postsPerPage);

    if (loading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>

            <div className="space-y-6">
                {currentPosts.map((post, index) => (
                    <article key={post.id} className="flex gap-6 group">
                        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                                src={post.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="mb-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {getCategoryForPost(startIndex + index)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    {getTitleForPost(post, startIndex + index)}
                                </Link>
                            </h3>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                                {getExcerptForPost(startIndex + index)}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="font-medium">{getAuthorForPost(startIndex + index)}</span>
                                <span>•</span>
                                <span>{formatDate(post.published_at || new Date())}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";

export default function PopularArticles() {
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
                // Transform and get first 3 posts as popular
                const transformedPosts: BlogPost[] = postsData.slice(0, 3).map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt,
                    image: post.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
                    category: "Tech",
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

                setPopularPosts(transformedPosts);
            }
        } catch (error) {

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
            <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
            <div className="space-y-4">
                {popularPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                    >
                        <div className="flex gap-3">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                    src={post.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(post.published_at || new Date())}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

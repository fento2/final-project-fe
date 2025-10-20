"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { LoadingCards } from "../../../components/ui/loading";
import { apiCall } from "../../../helper/apiCall";
import { BlogPost } from "../../../types/database";

export default function BlogGrid() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Fetch posts langsung dari backend
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);


            const { data } = await apiCall.get('/blog');



            // Handle different response structures
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];

            if (Array.isArray(postsData)) {
                // Transform backend data to match frontend BlogPost interface
                const transformedPosts: BlogPost[] = postsData.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt,
                    image: post.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
                    category: "Tech", // Default category since backend doesn't provide this field
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

                setPosts(transformedPosts);

            } else {

                setPosts([]);
            }
        } catch (err: any) {
            console.error('Error fetching blog posts:', err);

            // Check for specific backend errors
            if (err.response?.status === 500) {
                setError('Backend database connection issue. Please check if the database is running.');
            } else if (err.code === 'ECONNREFUSED') {
                setError('Backend server is not running. Please start the backend server.');
            } else {
                setError(err.message || 'Failed to fetch blog posts');
            }
            setPosts([]); // Set kosong jika ada error
        } finally {
            setLoading(false);
        }
    };

    // Fetch data saat component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    // Extract unique categories from posts
    const categories = useMemo(() => {
        const uniqueCategories = ["All"];
        posts.forEach((post: BlogPost) => {
            if (post.category && !uniqueCategories.includes(post.category)) {
                uniqueCategories.push(post.category);
            }
        });
        return uniqueCategories;
    }, [posts]);

    // Filter posts by category
    const filteredPosts = useMemo(() => {


        if (selectedCategory === "All") {
            // Menampilkan semua post yang published
            const published = posts.filter((post: BlogPost) => post.status === 'published');

            return published;
        }

        // Filter berdasarkan kategori spesifik
        const categoryFiltered = posts.filter((post: BlogPost) =>
            post.category === selectedCategory && post.status === 'published'
        );

        return categoryFiltered;
    }, [posts, selectedCategory]);

    // Format date helper
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate read time if not provided
    const getReadTime = (post: any) => {
        if (post.read_time) {
            return `${post.read_time} min read`;
        }
        // Estimate read time based on content length (average 200 words per minute)
        const words = post.content ? post.content.split(' ').length : 0;
        const readTime = Math.max(1, Math.ceil(words / 200));
        return `${readTime} min read`;
    };
    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === selectedCategory
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && <LoadingCards />}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-md">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Issue</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={fetchPosts}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content - Show posts or empty state */}
                {!loading && !error && (
                    <>
                        {/* Empty State only when no posts at all */}
                        {filteredPosts.length === 0 && posts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No blog posts available at the moment.</p>
                                <button
                                    onClick={fetchPosts}
                                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}

                        {/* No posts for selected category but posts exist */}
                        {filteredPosts.length === 0 && posts.length > 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No blog posts found for the selected category.</p>
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    View all posts
                                </button>
                            </div>
                        )}

                        {/* Blog Grid */}
                        {filteredPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post: BlogPost) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group ring-1 ring-gray-100 hover:ring-indigo-100 hover:-translate-y-0.5 will-change-transform"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={post.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop"}
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
                                                    {formatDate(post.published_at || new Date())}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {getReadTime(post)}
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
                        )}

                        {/* Load More Button - Show only when posts are available */}
                        {filteredPosts.length > 0 && (
                            <div className="text-center mt-12">
                                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

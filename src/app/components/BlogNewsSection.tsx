"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";
import Link from "next/link";

const BlogNewsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch posts langsung dari backend
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await apiCall.get('/blog');
            
            // Handle different response structures
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
            
            if (Array.isArray(postsData) && postsData.length > 0) {
                // Transform posts for consistent structure
                const transformedPosts = postsData.slice(0, 6).map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt || post.description || "Read more about this topic...",
                    image: post.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
                    category: post.category || "Blog",
                    author: {
                        name: post.author?.name || "Admin",
                        avatar: post.author?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                        initials: (post.author?.name || "Admin").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    },
                    published_at: new Date(post.created_at || post.published_at || Date.now()),
                    created_at: new Date(post.created_at || Date.now()),
                    updated_at: new Date(post.updated_at || Date.now()),
                    read_time: post.read_time || Math.max(1, Math.ceil((post.content?.split(' ').length || 300) / 200)),
                    status: 'published' as const
                }));
                setBlogPosts(transformedPosts);
            } else {
                setBlogPosts([]);
            }
        } catch (err: any) {
            console.error('Error fetching blog posts for home:', err);
            setError(err.message || 'Failed to fetch blog posts');
            setBlogPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data saat component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    // Helper function to format date
    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blog posts...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <p className="text-red-600">Failed to load blog posts: {error}</p>
                </div>
            </section>
        );
    }

    if (!blogPosts || blogPosts.length === 0) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <p className="text-gray-600">No blog posts available</p>
                </div>
            </section>
        );
    }
    
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogPosts.length);
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + blogPosts.length) % blogPosts.length);
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Blog & News
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Expert advice and career resources all in the Horizon Jobs Blog.
                    </p>
                </div>
                {/* Mobile Carousel */}
                <div className="block md:hidden mb-16">
                    <div className="relative">
                        {/* Carousel Container */}
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 280}px)` }}
                            >
                                {blogPosts.slice(0, 3).map((post: any) => (
                                    <div key={post.id} className="flex-shrink-0 w-64 mr-4">
                                        <Link href={`/blog/${post.slug}`}>
                                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer">
                                                <div className="relative h-40 bg-gray-100 overflow-hidden">
                                                    {post.image || post.featured_image ? (
                                                        <img 
                                                            src={post.image || post.featured_image} 
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-500 text-xs">Blog Image</span>
                                                        </div>
                                                    )}
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute top-2 left-2 bg-blue-100 text-blue-600 font-medium px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {post.category || "Blog"}
                                                    </Badge>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="text-sm font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-3 leading-relaxed text-xs line-clamp-2">
                                                        {post.excerpt || post.description}
                                                    </p>
                                                    {/* Author and Date */}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                                                                {post.author?.name?.charAt(0) || 'A'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-xs text-gray-900 truncate">{post.author?.name || 'Anonymous'}</p>
                                                            <p className="text-xs text-gray-500">{formatDate(post.created_at || post.published_at || post.date)}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {blogPosts.slice(0, 3).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {blogPosts.slice(0, 3).map((post: any) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer h-full">
                                <div className="relative h-56 md:h-64 bg-gray-100 overflow-hidden">
                                    {post.image || post.featured_image ? (
                                        <img 
                                            src={post.image || post.featured_image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">Blog Image Placeholder</span>
                                        </div>
                                    )}
                                    <Badge
                                        variant="secondary"
                                        className="absolute top-4 left-4 bg-blue-100 text-blue-600 font-medium px-3 py-1 rounded-full"
                                    >
                                        {post.category || "Blog"}
                                    </Badge>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                        {post.excerpt || post.description}
                                    </p>

                                    {/* Author and Date */}
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                                {post.author?.name?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-900">{post.author?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">{formatDate(post.created_at || post.published_at || post.date)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                {/* View All Articles Button */}
                <div className="text-center">
                    <Link href="/blog">
                        <Button
                            variant="outline"
                            className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
                        >
                            View All Articles
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogNewsSection;

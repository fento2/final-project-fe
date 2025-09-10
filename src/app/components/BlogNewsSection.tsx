"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlog";

const BlogNewsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { posts: blogPosts, loading, error } = useBlogPosts(6); // Limit to 6 posts

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
                                {blogPosts.map((post: any) => (
                                    <div key={post.id} className="flex-shrink-0 w-64 mr-4">
                                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                                            <div className="relative h-40 bg-gray-100 overflow-hidden">
                                                                {post.featured_image ? (
                                                    <img 
                                                        src={post.featured_image} 
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
                        {blogPosts.map((_, index) => (
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
                    {blogPosts.map((post: any) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                            <div className="relative h-56 md:h-64 bg-gray-100 overflow-hidden">
                                {post.featured_image ? (
                                    <img 
                                        src={post.featured_image} 
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
                    ))}
                </div>
                {/* View All Articles Button */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
                    >
                        View All Articles
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default BlogNewsSection;

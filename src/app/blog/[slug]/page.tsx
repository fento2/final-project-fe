"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlog";

interface BlogPageProps {
    params: {
        slug: string;
    };
}

export default function BlogPage({ params }: BlogPageProps) {
    const { post, loading, error } = useBlogPost(params.slug);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !post) {
        notFound();
    }
    // Helper function to format date
    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                    
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Image
                                src={post.author?.avatar || "/images/default-avatar.jpg"}
                                alt={post.author?.name || "Author"}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className="font-medium">{post.author?.name || "Unknown Author"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.published_at || post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time || "5 min read"}
                        </div>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.image && (
                <div className="relative h-96 w-full">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Author Bio */}
                {post.author && (
                    <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <Image
                                src={post.author.avatar || "/images/default-avatar.jpg"}
                                alt={post.author.name}
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {post.author.name}
                                </h3>
                                <p className="text-gray-600">
                                    Content Writer & Career Expert
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Articles */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Related Articles
                    </h3>
                    <div className="text-center text-gray-500">
                        <p>More related articles coming soon...</p>
                    </div>
                </div>
            </article>
        </div>
    );
}

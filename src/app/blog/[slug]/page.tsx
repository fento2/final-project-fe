"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { marked } from "marked";
import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";
import PopularArticles from "./components/PopularArticles";
import PopularCategories from "./components/PopularCategories";
import SearchWidget from "./components/SearchWidget";
import Comments from "./components/Comments";
import "./blog-detail.css";

export default function BlogPage() {
    const params = useParams<{ slug: string | string[] }>();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch single post dari backend
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);



            // Coba fetch post spesifik berdasarkan slug
            try {
                const { data } = await apiCall.get(`/blog/${slug}`);

                // Transform backend data to match frontend BlogPost interface
                if (data?.data) {
                    const transformedPost: BlogPost = {
                        id: data.data.id,
                        title: data.data.title,
                        slug: data.data.slug,
                        content: data.data.content,
                        excerpt: data.data.excerpt,
                        image: data.data.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
                        category: "Tech", // Default category
                        author: {
                            name: data.data.author?.name || data.data.author?.username || "Admin",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                            initials: (data.data.author?.name || data.data.author?.username || "A").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                        },
                        published_at: new Date(data.data.created_at),
                        created_at: new Date(data.data.created_at),
                        updated_at: new Date(data.data.updated_at),
                        read_time: Math.max(1, Math.ceil(data.data.content?.split(' ').length / 200)) || 5,
                        status: (data.data.published ? 'published' : 'draft') as 'published' | 'draft'
                    };
                    setPost(transformedPost);
                } else if (data) {
                    // Handle direct data response (backup)
                    const transformedPost: BlogPost = {
                        id: data.id,
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        excerpt: data.excerpt,
                        image: data.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
                        category: "Tech", // Default category
                        author: {
                            name: data.author?.name || data.author?.username || "Admin",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                            initials: (data.author?.name || data.author?.username || "A").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                        },
                        published_at: new Date(data.created_at),
                        created_at: new Date(data.created_at),
                        updated_at: new Date(data.updated_at),
                        read_time: Math.max(1, Math.ceil(data.content?.split(' ').length / 200)) || 5,
                        status: (data.published ? 'published' : 'draft') as 'published' | 'draft'
                    };
                    setPost(transformedPost);
                }
                return;
            } catch (slugErr: any) {
                // Jika endpoint spesifik tidak ada, coba get semua posts dan cari berdasarkan slug
                if (slugErr.response?.status === 404) {

                    const { data } = await apiCall.get('/blog');
                    const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];

                    if (Array.isArray(postsData)) {
                        const foundPost = postsData.find((p: any) =>
                            p.slug === slug ||
                            p.title.toLowerCase().replace(/\s+/g, '-') === slug
                        );

                        if (foundPost) {

                            // Transform the found post
                            const transformedPost: BlogPost = {
                                id: foundPost.id,
                                title: foundPost.title,
                                slug: foundPost.slug,
                                content: foundPost.content,
                                excerpt: foundPost.excerpt,
                                image: foundPost.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
                                category: "Tech",
                                author: {
                                    name: foundPost.author?.name || foundPost.author?.username || "Admin",
                                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                                    initials: (foundPost.author?.name || foundPost.author?.username || "A").split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                                },
                                published_at: new Date(foundPost.created_at),
                                created_at: new Date(foundPost.created_at),
                                updated_at: new Date(foundPost.updated_at),
                                read_time: Math.max(1, Math.ceil(foundPost.content?.split(' ').length / 200)) || 5,
                                status: (foundPost.published ? 'published' : 'draft') as 'published' | 'draft'
                            };
                            setPost(transformedPost);
                        } else {

                            setPost(null);
                        }
                    } else {

                        setPost(null);
                    }
                } else {
                    throw slugErr;
                }
            }
        } catch (err: any) {
            console.error('Error fetching blog post:', err);
            setError(err.message || 'Failed to fetch blog post');
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!slug) return;
        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 mb-4">
                        {error || "The blog post you're looking for doesn't exist."}
                    </p>
                    <Link
                        href="/blog"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
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

    // Helper function to parse markdown content
    const parseMarkdown = (content: string): string => {
        return marked(content, {
            breaks: true,
            gfm: true,
            async: false,
        }) as string;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-900">Job Trends</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="bg-white rounded-lg overflow-hidden">
                            {/* Article Header */}
                            <div className="p-8 pb-0">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Job Trends
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex items-center gap-4 pb-6">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={post.author?.avatar || "/images/default-avatar.jpg"}
                                            alt={post.author?.name || "Author"}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{post.author?.name || "Unknown Author"}</div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(post.published_at || new Date())}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-auto">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            {post.read_time ? `${post.read_time} min read` : "5 min read"}
                                        </div>
                                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {post.image && (
                                <div className="relative h-80 w-full">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="p-8">
                                <div className="prose prose-lg max-w-none prose-indigo">
                                    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
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
                                                <p className="text-gray-600 mb-3">
                                                    Content writer and career counseling for business and technology. With over
                                                    5 years experience in the industry, Jane has written for leading companies
                                                    worldwide, including Fortune 500 Companies and Small Business.
                                                </p>
                                                <div className="flex gap-2">
                                                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                                        <span className="text-sm">f</span>
                                                    </button>
                                                    <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                                                        <span className="text-sm">t</span>
                                                    </button>
                                                    <button className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                                                        <span className="text-sm">in</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Comments Section */}
                                <Comments postId={post.id.toString()} />
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <SearchWidget />
                            <PopularCategories />
                            <PopularArticles />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-between items-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous Post
                    </Link>
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Next Post
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

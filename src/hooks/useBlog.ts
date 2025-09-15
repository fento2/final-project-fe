"use client";

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/database';
import { apiCall } from '@/helper/apiCall';

interface UseBlogPostsReturn {
    posts: BlogPost[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useBlogPosts = (limit?: number): UseBlogPostsReturn => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching blog posts from backend...');
            const { data } = await apiCall.get('/blog', {
                params: {
                    limit
                }
            });
            
            console.log('Backend response:', data);
            
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
                console.log('Posts transformed and set successfully:', transformedPosts);
            } else {
                console.log('Invalid posts data structure, setting empty array');
                setPosts([]);
            }
        } catch (err: any) {
            console.error('Blog API Error:', err.response?.status, err.message);
            setError(err.message || 'Failed to fetch blog posts');
            setPosts([]); // Set empty array pada error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [limit]);

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts
    };
};

interface UseBlogPostReturn {
    post: BlogPost | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useBlogPost = (slug: string): UseBlogPostReturn => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching blog post from backend:', slug);
            
            // Try to fetch specific post by slug first
            try {
                const { data } = await apiCall.get(`/blog/${slug}`);
                console.log('Blog post response:', data);
                
                // Transform backend data to match frontend BlogPost interface
                if (data) {
                    const transformedPost: BlogPost = {
                        id: data.id,
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        excerpt: data.excerpt,
                        image: data.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
                        category: "Tech", // Default category since backend doesn't provide this field
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
                // If specific endpoint doesn't exist, try getting all posts and finding by slug
                if (slugErr.response?.status === 404) {
                    console.log('Single post endpoint not found, trying to get all posts...');
                    const { data } = await apiCall.get('/blog');
                    const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
                    
                    if (Array.isArray(postsData)) {
                        const foundPost = postsData.find((p: any) => 
                            p.slug === slug || 
                            p.title.toLowerCase().replace(/\s+/g, '-') === slug
                        );
                        
                        if (foundPost) {
                            console.log('Found post in all posts:', foundPost);
                            // Transform the found post
                            const transformedPost: BlogPost = {
                                id: foundPost.id,
                                title: foundPost.title,
                                slug: foundPost.slug,
                                content: foundPost.content,
                                excerpt: foundPost.excerpt,
                                image: foundPost.featured_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
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
                            console.log('Post not found in all posts');
                            setPost(null);
                        }
                    } else {
                        console.log('Invalid posts data structure');
                        setPost(null);
                    }
                } else {
                    throw slugErr;
                }
            }
        } catch (err: any) {
            console.error('Blog Post API Error:', err.response?.status, err.message);
            setError(err.message || 'Failed to fetch blog post');
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    return {
        post,
        loading,
        error,
        refetch: fetchPost
    };
};

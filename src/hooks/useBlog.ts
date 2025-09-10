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
            const { data } = await apiCall.get('/blog', {
                params: {
                    limit
                }
            });
            
            // Handle backend response structure: { success, message, data: { blogs: [...] } }
            const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
            setPosts(Array.isArray(postsData) ? postsData : []);
        } catch (err: any) {
            // Silently handle backend connection issues and auth errors
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setPosts([]);
                setError(null);
            } else {
                console.error('Error fetching blog posts:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
            }
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
            
            // Try to fetch specific post by slug first
            try {
                const { data } = await apiCall.get(`/blog/${slug}`);
                setPost(data);
                return;
            } catch (slugErr: any) {
                // If specific endpoint doesn't exist, try getting all posts and finding by slug
                if (slugErr.response?.status === 404) {
                    const { data } = await apiCall.get('/blog');
                    const postsData = data?.data?.blogs || data?.blogs || data?.data || data || [];
                    
                    if (Array.isArray(postsData)) {
                        const foundPost = postsData.find((p: BlogPost) => 
                            p.slug === slug || 
                            p.title.toLowerCase().replace(/\s+/g, '-') === slug
                        );
                        setPost(foundPost || null);
                    } else {
                        setPost(null);
                    }
                } else {
                    throw slugErr;
                }
            }
        } catch (err: any) {
            // Silently handle backend connection issues and auth errors
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setPost(null);
                setError(null);
            } else {
                console.error('Error fetching blog post:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
            }
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

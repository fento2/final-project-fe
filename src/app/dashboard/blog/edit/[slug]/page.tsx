"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBlogPost, updateBlogPost } from "@/fetch/blog.fetch";
import { useAuthStore } from "@/lib/zustand/authStore";
import TextEditor from "@/app/dashboard/components/TextEditor";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams<{ slug: string }>();
    const slug = params?.slug;
    const { role, isLogin } = useAuthStore();
    const isAdmin = (role || "").toUpperCase() === "DEVELOPER" || (role || "").toUpperCase() === "ADMIN";

    const [title, setTitle] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [newImagePreview, setNewImagePreview] = useState<string>("");
    const [status, setStatus] = useState<'draft' | 'published'>("draft");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalPost, setOriginalPost] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await getBlogPost(slug as string);
                if (data) {
                    setTitle(data.title || "");
                    setNewSlug(data.slug || "");
                    setExcerpt(data.excerpt || "");
                    setContent(data.content || "");
                    setFeaturedImage(data.featured_image || "");
                    setStatus(data.published ? 'published' : 'draft');
                    setOriginalPost(data);
                }
            } catch (e) {

            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (!isLogin || !isAdmin) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
                <p className="text-gray-600">Halaman ini khusus Admin.</p>
            </div>
        );
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug) return;
        try {
            setSaving(true);
            await updateBlogPost(slug as string, {
                title,
                slug: newSlug,
                excerpt,
                content,
                featured_image_file: newImageFile || undefined,
                status,
            });
            router.push("/dashboard/blog");
        } catch (e) {

        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Edit Form */}
                    <form className="grid gap-4 lg:col-span-2" onSubmit={onSubmit}>
                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input className="w-full border rounded-md px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                {originalPost?.title && (
                                    <p className="mt-1 text-xs text-gray-500">Current: {originalPost.title}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <input className="w-full border rounded-md px-3 py-2" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
                                {originalPost?.slug && (
                                    <p className="mt-1 text-xs text-gray-500">Current: {originalPost.slug}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Excerpt</label>
                                <textarea className="w-full border rounded-md px-3 py-2" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                                {originalPost?.excerpt && (
                                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">Current: {originalPost.excerpt}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Featured Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setNewImageFile(file);
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setNewImagePreview(url);
                                        } else {
                                            setNewImagePreview("");
                                        }
                                    }}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                                {newImagePreview && (
                                    <img src={newImagePreview} alt="New preview" className="mt-2 w-full max-h-48 object-cover rounded-md border" />
                                )}
                                {originalPost?.featured_image && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Current preview:</p>
                                        <img src={originalPost.featured_image} alt="Current featured" className="w-full max-h-48 object-cover rounded-md border" />
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <label className="block text-sm font-medium mb-2">Content</label>
                            <TextEditor value={content} setValue={setContent} profile={false} />
                            {originalPost?.content && (
                                <details className="mt-3">
                                    <summary className="text-xs text-gray-500 cursor-pointer">Show current content (read-only)</summary>
                                    <div className="prose max-w-none mt-2 p-3 border rounded-md bg-gray-50" dangerouslySetInnerHTML={{ __html: originalPost.content }} />
                                </details>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select className="w-full border rounded-md px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                {typeof originalPost?.published !== 'undefined' && (
                                    <p className="mt-1 text-xs text-gray-500">Current: {originalPost.published ? 'published' : 'draft'}</p>
                                )}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/blog')} className="px-4 py-2 border rounded-md">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Current Data Card */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-4 sm:p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-3">Current Post</h2>
                            {originalPost?.featured_image && (
                                <img src={originalPost.featured_image} alt="Featured" className="w-full h-40 object-cover rounded-md border mb-3" />
                            )}
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="block text-gray-500">Title</span>
                                    <span className="font-medium text-gray-900 break-words">{originalPost?.title}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Slug</span>
                                    <span className="text-gray-900 break-words">{originalPost?.slug}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Status</span>
                                    <span className="text-gray-900">{originalPost?.published ? 'published' : 'draft'}</span>
                                </div>
                                {originalPost?.created_at && (
                                    <div>
                                        <span className="block text-gray-500">Created</span>
                                        <span className="text-gray-900">{new Date(originalPost.created_at).toLocaleString()}</span>
                                    </div>
                                )}
                                {originalPost?.updated_at && (
                                    <div>
                                        <span className="block text-gray-500">Updated</span>
                                        <span className="text-gray-900">{new Date(originalPost.updated_at).toLocaleString()}</span>
                                    </div>
                                )}
                                {originalPost?.excerpt && (
                                    <div>
                                        <span className="block text-gray-500">Excerpt</span>
                                        <p className="text-gray-900 line-clamp-4">{originalPost.excerpt}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

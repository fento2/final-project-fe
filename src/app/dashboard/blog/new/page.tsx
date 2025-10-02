"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/fetch/blog.fetch";
import { useAuthStore } from "@/lib/zustand/authStore";
import TextEditor from "@/app/dashboard/components/TextEditor";

export default function NewBlogPage() {
    const router = useRouter();
    const { role, isLogin } = useAuthStore();
    const isAdmin = (role || "").toUpperCase() === "DEVELOPER" || (role || "").toUpperCase() === "ADMIN";

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [featuredPreview, setFeaturedPreview] = useState<string>("");
    const [status, setStatus] = useState<'draft' | 'published'>("draft");
    const [saving, setSaving] = useState(false);

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
        try {
            setSaving(true);
            await createBlogPost({ title, slug, excerpt, content, featured_image_file: featuredImageFile, status });
            router.push("/dashboard/blog");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <form className="grid gap-4 max-w-3xl" onSubmit={onSubmit} encType="multipart/form-data">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input className="w-full border rounded-md px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input className="w-full border rounded-md px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-awesome-post" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <textarea className="w-full border rounded-md px-3 py-2" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Featured Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFeaturedImageFile(file);
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setFeaturedPreview(url);
                            } else {
                                setFeaturedPreview("");
                            }
                        }}
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {featuredPreview && (
                        <img src={featuredPreview} alt="Preview" className="mt-2 w-full max-h-56 object-cover rounded-md border" />
                    )}
                    <p className="text-xs text-gray-500 mt-1">Optional. JPG, PNG, GIF, WebP, SVG. Up to ~10MB.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <TextEditor value={content} setValue={setContent} profile={false} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full border rounded-md px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => router.push('/dashboard/blog')} className="px-4 py-2 border rounded-md">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

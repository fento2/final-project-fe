"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";
import { deleteBlogPost } from "@/fetch/blog.fetch";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useAuthRole } from "@/helper/useAuthRole";

export default function BlogDashboardPage() {
    useAuthRole('DEVELOPER')
    const { role, isLogin } = useAuthStore();
    const { posts, loading, error, refetch } = useBlogPosts();
    const [deleting, setDeleting] = useState<string | null>(null);

    const isAdmin = (role || "").toUpperCase() === "DEVELOPER" || (role || "").toUpperCase() === "ADMIN";

    if (!isLogin || !isAdmin) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
                <p className="text-gray-600">Halaman ini khusus Admin.</p>
            </div>
        );
    }

    const handleDelete = async (idOrSlug: string) => {
        if (!confirm("Delete this post? This action cannot be undone.")) return;
        try {
            setDeleting(idOrSlug);
            await deleteBlogPost(idOrSlug);
            await refetch();
        } catch (e) {

        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blog Manager</h1>
                <Link href="/dashboard/blog/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Plus className="w-4 h-4" /> New Post
                </Link>
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin" /> Loading...</div>
            )}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && posts.length === 0 && (
                <div className="text-gray-600">No posts yet.</div>
            )}

            {!loading && posts.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Updated</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p) => (
                                <tr key={p.slug} className="border-t">
                                    <td className="px-4 py-3 font-medium">{p.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{new Date(p.created_at as any).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{new Date(p.updated_at as any).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/blog/${p.slug}`} className="p-2 hover:bg-gray-100 rounded-md" title="View">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/dashboard/blog/edit/${p.slug}`} className="p-2 hover:bg-gray-100 rounded-md" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(p.slug)} className="p-2 hover:bg-gray-100 rounded-md text-red-600" disabled={deleting === p.slug} title="Delete">
                                                {deleting === p.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

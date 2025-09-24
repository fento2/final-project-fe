import { apiCall } from "@/helper/apiCall";
import { BlogPost } from "@/types/database";

export interface BlogPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  /** Optional image URL (legacy); prefer using featured_image_file for uploads */
  featured_image?: string;
  /** Optional image File/Blob for Cloudinary upload */
  featured_image_file?: File | Blob | null;
  /** Optional status string; will be mapped to published boolean */
  status?: 'draft' | 'published';
  /** Optional published boolean (if provided directly) */
  published?: boolean;
}

function getAuthHeaders() {
  if (typeof window === 'undefined') return {} as Record<string, string>;
  try {
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` } as Record<string, string>;
    }
  } catch {}
  return {} as Record<string, string>;
}

function buildBlogFormData(payload: Partial<BlogPayload>) {
  const form = new FormData();
  if (typeof payload.title !== 'undefined') form.append('title', String(payload.title));
  if (typeof payload.content !== 'undefined') form.append('content', String(payload.content));
  if (typeof payload.excerpt !== 'undefined') form.append('excerpt', String(payload.excerpt));
  if (typeof payload.slug !== 'undefined') form.append('slug', String(payload.slug));

  // Map status to published if provided as string
  let published: boolean | undefined = payload.published;
  if (typeof payload.status !== 'undefined') {
    published = payload.status === 'published';
  }
  if (typeof published !== 'undefined') form.append('published', String(published));

  // Only send file if provided; backend preserves existing when omitted
  if (payload.featured_image_file instanceof Blob) {
    form.append('featured_image', payload.featured_image_file);
  }

  return form;
}

export async function getBlogPosts(params?: { limit?: number; page?: number }) {
  const { data } = await apiCall.get('/blog', { params });
  const items = data?.data?.blogs || data?.blogs || data?.data || data || [];
  return Array.isArray(items) ? items : [];
}

export async function getBlogPost(idOrSlug: string) {
  try {
    const { data } = await apiCall.get(`/blog/${idOrSlug}`);
    return data;
  } catch (err: any) {
    // Fallback: fetch all and find
    const list = await getBlogPosts();
    return list.find((p: any) => p.slug === idOrSlug || String(p.id) === String(idOrSlug));
  }
}

export async function createBlogPost(payload: BlogPayload) {
  const form = buildBlogFormData(payload);
  const { data } = await apiCall.post('/blog', form, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
  });
  return data;
}

export async function updateBlogPost(idOrSlug: string, payload: Partial<BlogPayload>) {
  const form = buildBlogFormData(payload);
  const { data } = await apiCall.put(`/blog/${idOrSlug}`, form, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
  });
  return data;
}

export async function deleteBlogPost(idOrSlug: string) {
  const { data } = await apiCall.delete(`/blog/${idOrSlug}`, { headers: { ...getAuthHeaders() } });
  return data;
}

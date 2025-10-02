// Helper function untuk absolute URL
export function toAbsoluteUrl(url?: string): string {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const base = process.env.NEXT_PUBLIC_URL_BE?.replace(/\/$/, "") || "";
    const u = url.startsWith("/") ? url : `/${url}`;
    return `${base}${u}`;
}

// Helper function untuk menghitung waktu posting
export function getTimeSincePosted(dateString?: string): string {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Helper function to truncate description
export function truncateDescription(description: string | null | undefined, maxLength: number = 120): string {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
}

export function slugify(title: string) {
    // ganti slash dan karakter bermasalah lalu encode
    return encodeURIComponent(title.replace(/\//g, "-"));
}
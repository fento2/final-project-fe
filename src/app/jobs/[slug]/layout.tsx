import type { Metadata } from 'next';

type Props = {
    children: React.ReactNode;
    params: { slug: string };
};

async function fetchJob(slug: string) {
    const base = process.env.NEXT_PUBLIC_URL_BE?.replace(/\/$/, '') || '';
    const url = `${base}/jobs/slug/${encodeURIComponent(slug)}`;
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        // Try common wrappers: { data: {...} } or direct object
        const job = data?.data ?? data;
        return job || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug;
    const job = await fetchJob(slug);

    const titleFromSlug = decodeURIComponent(slug).replace(/-/g, ' ');
    const title = job?.title ? `${job.title}${job?.Company?.name ? ` at ${job.Company.name}` : ''}` : titleFromSlug;
    const description = job?.description
        ? (typeof job.description === 'string' ? job.description.replace(/<[^>]*>/g, '').slice(0, 160) : '')
        : `Explore the job: ${titleFromSlug}`;

    const siteBase = process.env.NEXT_PUBLIC_URL_FE?.replace(/\/$/, '') || 'http://localhost:3000';
    const pageUrl = `${siteBase}/jobs/${slug}`;

    // Build a better default OG image (use a job banner instead of logo)
    const defaultBanner = `${siteBase}/images/bg_hero.jpg`;
    const beBase = process.env.NEXT_PUBLIC_URL_BE?.replace(/\/$/, '') || '';
    const image = job?.banner
        ? (job.banner.startsWith('http') ? job.banner : `${beBase}${job.banner.startsWith('/') ? '' : '/'}${job.banner}`)
        : job?.Company?.profile_picture
            ? (job.Company.profile_picture.startsWith('http') ? job.Company.profile_picture : `${beBase}${job.Company.profile_picture.startsWith('/') ? '' : '/'}${job.Company.profile_picture}`)
            : defaultBanner;

    // Article meta
    const authors = job?.Company?.name ? [job.Company.name] : undefined;
    const tags: string[] = [];
    if (job?.category && typeof job.category === 'string') tags.push(job.category);
    if (Array.isArray(job?.skills)) {
        for (const sk of job.skills) {
            const name = typeof sk === 'string' ? sk : sk?.name;
            if (name && typeof name === 'string') tags.push(name);
        }
    }
    const publishedTime = job?.createdAt || job?.created_at || undefined;
    const modifiedTime = job?.updatedAt || job?.updated_at || undefined;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: pageUrl,
            type: 'article',
            images: image ? [{ url: image }] : undefined,
            authors,
            tags: tags.length ? tags : undefined,
            publishedTime,
            modifiedTime,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : undefined,
        },
        alternates: {
            canonical: pageUrl,
        },
    };
}

export default function JobSlugLayout({ children }: Props) {
    return <>{children}</>;
}

// Helper function to generate clean, consistent job slugs
export const generateJobSlug = (job: any, forceClean: boolean = true): string => {
    // If forceClean is false, use existing slug if available
    if (!forceClean && job.slug && typeof job.slug === 'string') {
        return job.slug;
    }
    
    if (job.title && typeof job.title === 'string') {
        // Clean and shorten the title for a better slug
        let cleanTitle = job.title.toLowerCase()
            // Remove common words that don't add value
            .replace(/\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|over|after)\b/g, '')
            // Replace spaces and special characters with hyphens
            .replace(/[^a-z0-9]+/g, '-')
            // Remove multiple consecutive hyphens
            .replace(/-+/g, '-')
            // Remove leading and trailing hyphens
            .replace(/^-|-$/g, '');
        
        // Limit to reasonable length (around 4-5 words max for cleaner URLs)
        const words = cleanTitle.split('-').filter((word: string) => word.length > 0);
        const maxWords = 4;
        if (words.length > maxWords) {
            cleanTitle = words.slice(0, maxWords).join('-');
        }
        
        // Add company suffix if available for uniqueness (shorter version)
        if (job.Company?.name || job.company) {
            const companyName = job.Company?.name || job.company;
            const companySlug = companyName.toLowerCase()
                .replace(/[^a-z0-9]+/g, '')
                .substring(0, 8); // Limit company name to 8 chars for shorter URLs
            if (companySlug) {
                cleanTitle += `-${companySlug}`;
            }
        }
        
        return cleanTitle || `job-${job.job_id || job.id}`;
    }
    
    // Fallback to job_id or id
    return job.job_id?.toString() || job.id?.toString() || 'job-detail';
};

// Helper function to ensure slug is valid and not empty
export const validateSlug = (slug: string, fallbackId?: string | number): string => {
    if (!slug || slug.trim() === '') {
        return `job-${fallbackId || Date.now()}`;
    }
    return slug;
};
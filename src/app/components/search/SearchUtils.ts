// Text highlighting utilities

// Function to highlight search terms in text
export const highlightSearchTerms = (text: string, searchQuery: string): string => {
    if (!searchQuery || !text) return text;
    
    const searchWords = searchQuery.toLowerCase().split(/[\s_-]+/).filter(word => word.length >= 2);
    let highlightedText = text;
    
    searchWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
};

// Time utility functions
export const getTimeSincePosted = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

// Get relevance level for display
export const getRelevanceLevel = (score: number, query: string) => {
    if (!query) return null;
    
    if (score >= 15) return { label: 'Perfect Match', color: 'bg-green-100 text-green-800', icon: '🎯' };
    if (score >= 10) return { label: 'Excellent Match', color: 'bg-blue-100 text-blue-800', icon: '⭐' };
    if (score >= 6) return { label: 'Good Match', color: 'bg-purple-100 text-purple-800', icon: '✨' };
    if (score >= 3) return { label: 'Fair Match', color: 'bg-yellow-100 text-yellow-800', icon: '💡' };
    return { label: 'Basic Match', color: 'bg-gray-100 text-gray-800', icon: '📝' };
};

// Job data transformation utility
export const transformJobData = (job: any) => ({
    id: job.job_id?.toString() || job.id?.toString() || '',
    title: job.title || 'Job Position',
    company: job.Company?.name || job.Companies?.name || job.company?.name || 'Unknown Company',
    type: (job.job_type?.replace('_', ' ') || 'Full Time'),
    location: job.location || 'Remote',
    salaryMin: job.salary || job.salaryMin || 0,
    salaryMax: job.salaryMax || (job.salary ? job.salary * 1.2 : 0),
    tags: job.skills?.map((skill: any) => skill.name) || [],
    slug: job.slug || job.job_id?.toString() || job.id?.toString() || '',
    companyLogo: job.Company?.profile_picture || job.Companies?.profile_picture || null,
    createdAt: job.createdAt || job.created_at || new Date().toISOString(),
    _searchScore: job._searchScore,
});

// Debug logging utility
export const logSearchResults = (filtered: any[], backendJobs: any[], query: string, location: string) => {
    console.log('📊 Enhanced Search Results Summary:', {
        originalJobs: backendJobs.length,
        filteredJobs: filtered.length,
        query: query,
        location: location,
        hasLocation: Boolean(location),
        hasQuery: Boolean(query),
        averageScore: filtered.length > 0 ? 
            (filtered.reduce((sum: number, job: any) => sum + (job._searchScore || 0), 0) / filtered.length).toFixed(2) : 0,
        topScores: filtered.slice(0, 5).map((job: any) => ({
            title: job.title,
            score: job._searchScore?.toFixed(2) || '0',
        }))
    });
    
    // Debug: Log sample of filtered jobs with scoring details
    if (filtered.length > 0 && query) {
        console.log('🔍 Top 3 Search Matches with Scoring:', filtered.slice(0, 3).map((job: any) => ({
            title: job.title,
            company: job.company,
            location: job.location,
            totalScore: job._searchScore?.toFixed(2),
        })));
    } else if (query || location) {
        console.log('⚠️ No jobs found for search criteria');
    }
};
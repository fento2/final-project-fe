import { useState, useEffect } from 'react';
import { apiCall } from '@/helper/apiCall';

interface FilterStats {
    categories: { [key: string]: number };
    jobTypes: { [key: string]: number };
    locations: { [key: string]: number };
    languages: { [key: string]: number };
    tools: { [key: string]: number };
    datePosted: { [key: string]: number };
    totalJobs: number;
}

// Mock data generator for demonstration when backend is unavailable
const generateMockJobsForStats = () => {
    const categories = ["Technology", "Marketing", "Design", "Data Science", "Management", "Finance", "Sales", "Operations"];
    const jobTypes = ["Full Time", "Part-time", "Contract", "Remote", "Hybrid"];
    const locations = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Medan", "Remote"];
    
    return Array.from({ length: 50 }, (_, index) => ({
        job_id: index + 1,
        title: `Mock Job ${index + 1}`,
        category: categories[index % categories.length],
        job_type: jobTypes[index % jobTypes.length],
        location: locations[index % locations.length],
        description: "Sample job description with JavaScript, React, Python tools",
        createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
    }));
};

export const useFilterStats = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<FilterStats>({
        categories: {},
        jobTypes: {},
        locations: {},
        languages: {},
        tools: {},
        datePosted: {},
        totalJobs: 0
    });

    // Fetch jobs data same way as useFeaturedJobs
    useEffect(() => {
        const fetchJobsForStats = async () => {
            try {
                setLoading(true);
                // Use same endpoint as featured jobs: /postings with large limit for stats
                const { data } = await apiCall.get(`/postings?limit=200&sort=created_at&order=desc`);
                
                // Handle backend response structure same as useFeaturedJobs
                const jobsData = data?.data?.data || data?.data || data || [];
                let jobsList = Array.isArray(jobsData) ? jobsData : [];
                
                // If no data from backend, use mock data for demonstration (like in JobsGridSection)
                if (jobsList.length === 0) {
                    jobsList = generateMockJobsForStats();
                }
                
                setJobs(jobsList);
            } catch (err: any) {
                // Handle errors same way as useFeaturedJobs
                if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                    setJobs(generateMockJobsForStats());
                } else {
                    console.error('Filter stats fetch error:', err);
                    setJobs(generateMockJobsForStats());
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobsForStats();
    }, []);

    useEffect(() => {
        if (!loading && jobs.length > 0) {
            const newStats: FilterStats = {
                categories: {},
                jobTypes: {},
                locations: {},
                languages: {},
                tools: {},
                datePosted: {},
                totalJobs: jobs.length
            };

            // Calculate date ranges
            const now = new Date();
            const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const last3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            jobs.forEach(job => {
                // Count categories (same as feature jobs structure)
                const jobCategory = job.category || job.Category;
                if (jobCategory) {
                    newStats.categories[jobCategory] = (newStats.categories[jobCategory] || 0) + 1;
                }

                // Count job types (same as feature jobs structure)
                const jobType = job.job_type || job.type;
                if (jobType) {
                    newStats.jobTypes[jobType] = (newStats.jobTypes[jobType] || 0) + 1;
                }

                // Count locations (same as feature jobs structure)
                const jobLocation = job.location || job.city;
                if (jobLocation) {
                    newStats.locations[jobLocation] = (newStats.locations[jobLocation] || 0) + 1;
                }

                // Count languages (assuming it's stored in description)
                if (job.description) {
                    const englishPattern = /english|inggris/i;
                    const indonesianPattern = /indonesian|indonesia|bahasa indonesia/i;
                    const spanishPattern = /spanish|spanyol/i;
                    const italianPattern = /italian|italia/i;
                    const turkishPattern = /turkish|turki/i;

                    if (englishPattern.test(job.description || '')) {
                        newStats.languages['English'] = (newStats.languages['English'] || 0) + 1;
                    }
                    if (indonesianPattern.test(job.description || '')) {
                        newStats.languages['Indonesian'] = (newStats.languages['Indonesian'] || 0) + 1;
                    }
                    if (spanishPattern.test(job.description || '')) {
                        newStats.languages['Spanish'] = (newStats.languages['Spanish'] || 0) + 1;
                    }
                    if (italianPattern.test(job.description || '')) {
                        newStats.languages['Italian'] = (newStats.languages['Italian'] || 0) + 1;
                    }
                    if (turkishPattern.test(job.description || '')) {
                        newStats.languages['Turkish'] = (newStats.languages['Turkish'] || 0) + 1;
                    }
                }

                // Count tools (assuming they're mentioned in description)
                if (job.description) {
                    const toolPatterns = {
                        'Microsoft Word': /microsoft word|ms word|word/i,
                        'Microsoft Excel': /microsoft excel|ms excel|excel/i,
                        'Figma': /figma/i,
                        'Canva': /canva/i,
                        'Photoshop': /photoshop|ps/i,
                        'Illustrator': /illustrator|ai/i
                    };

                    Object.entries(toolPatterns).forEach(([tool, pattern]) => {
                        if (pattern.test(job.description || '')) {
                            newStats.tools[tool] = (newStats.tools[tool] || 0) + 1;
                        }
                    });
                }

                // Count by date posted (same as feature jobs structure)
                const jobCreatedAt = job.createdAt || job.created_at;
                if (jobCreatedAt) {
                    const jobDate = new Date(jobCreatedAt);
                    
                    if (jobDate >= last24Hours) {
                        newStats.datePosted['Last 24 hours'] = (newStats.datePosted['Last 24 hours'] || 0) + 1;
                    }
                    if (jobDate >= last3Days) {
                        newStats.datePosted['Last 3 days'] = (newStats.datePosted['Last 3 days'] || 0) + 1;
                    }
                    if (jobDate >= last7Days) {
                        newStats.datePosted['Last 7 days'] = (newStats.datePosted['Last 7 days'] || 0) + 1;
                    }
                    newStats.datePosted['Anytime'] = newStats.totalJobs;
                }
            });

            setStats(newStats);
        }
    }, [jobs, loading]);

    return { stats, loading };
};
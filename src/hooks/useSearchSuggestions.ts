import { useState, useEffect } from 'react';
import { useFilterStats } from './useFilterStats';
import { useJobs } from './useJobs';

export interface SearchSuggestion {
    value: string;
    type: 'keyword' | 'category' | 'location' | 'company' | 'title';
    count?: number;
    relevance?: number;
}

export const useSearchSuggestions = (query: string, type?: 'all' | 'category' | 'location') => {
    const { stats, loading } = useFilterStats();
    const { jobs } = useJobs();
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

    // Function to calculate relevance score
    const calculateRelevance = (text: string, query: string): number => {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerText === lowerQuery) return 100; // Exact match
        if (lowerText.startsWith(lowerQuery)) return 90; // Starts with
        if (lowerText.includes(` ${lowerQuery}`)) return 80; // Word boundary
        if (lowerText.includes(lowerQuery)) return 70; // Contains
        
        // Calculate similarity for partial matches
        const words = lowerQuery.split(' ');
        let wordMatches = 0;
        words.forEach(word => {
            if (lowerText.includes(word)) wordMatches++;
        });
        
        return (wordMatches / words.length) * 60;
    };

    useEffect(() => {
        if (loading || !query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const newSuggestions: SearchSuggestion[] = [];
        const lowerQuery = query.toLowerCase();

        // Add category suggestions (PRIORITY: akan masuk ke category field)
        if (!type || type === 'all' || type === 'category') {
            Object.entries(stats.categories).forEach(([category, count]) => {
                const relevance = calculateRelevance(category, query);
                if (relevance > 50) {
                    newSuggestions.push({
                        value: category,
                        type: 'category',
                        count,
                        relevance
                    });
                }
            });
        }

        // Add location suggestions (PRIORITY: akan masuk ke location field)
        if (!type || type === 'all' || type === 'location') {
            Object.entries(stats.locations).forEach(([location, count]) => {
                const relevance = calculateRelevance(location, query);
                if (relevance > 50) {
                    newSuggestions.push({
                        value: location,
                        type: 'location',
                        count,
                        relevance
                    });
                }
            });
        }

        // Add job title suggestions from actual jobs (NEW FEATURE)
        if (!type || type === 'all') {
            const titleMatches: { [key: string]: number } = {};
            jobs.forEach(job => {
                const relevance = calculateRelevance(job.title, query);
                if (relevance > 60) {
                    // Extract meaningful keywords from job title
                    const titleWords = job.title.toLowerCase()
                        .split(/[\s\-\/]+/)
                        .filter(word => word.length > 2)
                        .filter(word => !['the', 'and', 'for', 'with', 'job', 'position'].includes(word));
                    
                    titleWords.forEach(word => {
                        if (word.includes(lowerQuery) || lowerQuery.includes(word)) {
                            titleMatches[word] = (titleMatches[word] || 0) + 1;
                        }
                    });
                }
            });

            // Add top title keywords as suggestions
            Object.entries(titleMatches)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .forEach(([keyword, count]) => {
                    newSuggestions.push({
                        value: keyword,
                        type: 'title',
                        count,
                        relevance: calculateRelevance(keyword, query)
                    });
                });
        }

        // Add job type suggestions
        if (!type || type === 'all') {
            Object.entries(stats.jobTypes).forEach(([jobType, count]) => {
                const relevance = calculateRelevance(jobType, query);
                if (relevance > 50) {
                    newSuggestions.push({
                        value: jobType,
                        type: 'keyword',
                        count,
                        relevance
                    });
                }
            });
        }

        // Add enhanced common keywords based on job market
        if (!type || type === 'all') {
            const enhancedKeywords = [
                // Programming & Tech
                'javascript', 'python', 'react', 'nodejs', 'php', 'java', 'html', 'css',
                'frontend', 'backend', 'fullstack', 'mobile', 'android', 'ios', 'flutter',
                'database', 'mysql', 'postgresql', 'mongodb', 'api', 'rest', 'graphql',
                
                // Roles & Levels
                'developer', 'engineer', 'programmer', 'architect', 'lead', 'senior', 'junior',
                'intern', 'trainee', 'manager', 'director', 'head', 'chief', 'specialist',
                'analyst', 'consultant', 'coordinator', 'assistant', 'executive',
                
                // Domains
                'design', 'marketing', 'sales', 'finance', 'accounting', 'hr', 'admin',
                'customer service', 'support', 'operations', 'logistics', 'procurement',
                'business', 'strategy', 'product', 'project', 'quality', 'testing',
                
                // Work Types
                'remote', 'hybrid', 'onsite', 'freelance', 'contract', 'permanent',
                'part-time', 'full-time', 'temporary', 'internship', 'volunteer'
            ];

            enhancedKeywords.forEach(keyword => {
                const relevance = calculateRelevance(keyword, query);
                if (relevance > 50) {
                    newSuggestions.push({
                        value: keyword,
                        type: 'keyword',
                        relevance
                    });
                }
            });
        }

        // Sort by relevance and type priority
        const sortedSuggestions = newSuggestions
            .sort((a, b) => {
                // Priority: category > location > title > keyword
                const typePriority = {
                    'category': 1000,
                    'location': 900,
                    'title': 800,
                    'keyword': 700,
                    'company': 600
                };

                const aPriority = (typePriority[a.type] || 0) + (a.relevance || 0);
                const bPriority = (typePriority[b.type] || 0) + (b.relevance || 0);

                if (aPriority !== bPriority) return bPriority - aPriority;

                // Secondary sort by count
                if (a.count && b.count) return b.count - a.count;
                if (a.count && !b.count) return -1;
                if (!a.count && b.count) return 1;

                // Final sort alphabetically
                return a.value.localeCompare(b.value);
            })
            .slice(0, 8); // Limit to 8 suggestions

        setSuggestions(sortedSuggestions);
    }, [query, stats, jobs, loading, type]);

    return { suggestions, loading };
};

// Hook for popular searches based on backend data
export const usePopularSearches = () => {
    const { stats, loading } = useFilterStats();
    const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>([]);

    useEffect(() => {
        if (!loading && Object.keys(stats.categories).length > 0) {
            // Get top 3 categories as popular searches
            const popular = Object.entries(stats.categories)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([category, count]) => ({
                    value: category,
                    type: 'category' as const,
                    count
                }));

            setPopularSearches(popular);
        }
    }, [stats, loading]);

    return { popularSearches, loading };
};
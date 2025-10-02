// Enhanced search algorithm utilities
export interface SearchMatch {
    score: number;
    hasMatch: boolean;
    coverage: number;
}

export interface SearchResult {
    _searchScore?: number;
    _searchDetails?: {
        title: SearchMatch;
        category: SearchMatch;
        company: SearchMatch;
        description: SearchMatch;
        jobType: SearchMatch;
        skills: SearchMatch;
        total: number;
    };
}

// Simple string similarity calculator
export const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
};

// Levenshtein distance for fuzzy matching
export const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
        Array(str1.length + 1).fill(null)
    );
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + substitutionCost
            );
        }
    }
    
    return matrix[str2.length][str1.length];
};

// Enhanced matching function with better scoring
export const advancedMatch = (text: any, searchTerm: string, weight: number = 1): SearchMatch => {
    if (!text || typeof text !== 'string') return { score: 0, hasMatch: false, coverage: 0 };
    
    const normalizedText = text.toLowerCase();
    const searchWords = searchTerm.split(/[\s_-]+/).filter(word => word.length >= 2);
    
    if (searchWords.length === 0) return { score: 0, hasMatch: false, coverage: 0 };
    
    let totalScore = 0;
    let matchedWords = 0;
    
    for (const searchWord of searchWords) {
        let wordScore = 0;
        
        // 1. Exact phrase match (highest priority)
        if (normalizedText.includes(searchTerm)) {
            wordScore = 10;
        }
        // 2. Exact word match at word boundaries
        else if (new RegExp(`\\b${searchWord}\\b`).test(normalizedText)) {
            wordScore = 8;
        }
        // 3. Exact word match anywhere
        else if (normalizedText.includes(searchWord)) {
            wordScore = 6;
        }
        // 4. Starts with search word
        else if (normalizedText.split(/[\s_-]+/).some(word => word.startsWith(searchWord))) {
            wordScore = 4;
        }
        // 5. Contains search word as substring (for longer words)
        else if (searchWord.length >= 3) {
            const words = normalizedText.split(/[\s_-]+/);
            for (const word of words) {
                if (word.length >= 3) {
                    // Check if word contains searchWord or vice versa
                    if (word.includes(searchWord) || searchWord.includes(word)) {
                        wordScore = Math.max(wordScore, 2);
                    }
                    // Fuzzy matching for similar words
                    else if (word.length >= 4 && searchWord.length >= 4) {
                        const similarity = calculateSimilarity(word, searchWord);
                        if (similarity >= 0.7) {
                            wordScore = Math.max(wordScore, 1);
                        }
                    }
                }
            }
        }
        
        if (wordScore > 0) {
            matchedWords++;
            totalScore += wordScore;
        }
    }
    
    // Calculate final score with word coverage bonus
    const wordCoverage = matchedWords / searchWords.length;
    const finalScore = (totalScore * wordCoverage * weight);
    
    return {
        score: finalScore,
        hasMatch: matchedWords > 0,
        coverage: wordCoverage
    };
};

// Filter and score jobs based on search criteria
export const filterJobsBySearch = (jobs: any[], query: string, location: string) => {
    return jobs.filter((job: any) => {
        // 1. STRICT LOCATION FILTERING
        if (location) {
            const jobLocation = (job.location || '').toLowerCase();
            const searchLocation = location.toLowerCase();
            
            // Check for exact match or city match (before comma)
            const jobCity = jobLocation.split(',')[0].trim();
            const searchCity = searchLocation.split(',')[0].trim();
            
            const locationMatch = jobLocation.includes(searchLocation) || 
                                jobCity.includes(searchCity) ||
                                searchLocation.includes(jobCity);
            
            if (!locationMatch) {
                return false; // Strict: if no location match, exclude completely
            }
        }
        
        // 2. ENHANCED QUERY MATCHING WITH SCORING
        if (!query) return true;
        
        const searchTerm = query.toLowerCase().trim();
        
        // Apply enhanced matching to different fields with weights
        const titleResult = advancedMatch(job.title || '', searchTerm, 3.0);
        const categoryResult = advancedMatch(job.category || job.Category || '', searchTerm, 2.5);
        const companyResult = advancedMatch(job.Company?.name || job.Companies?.name || job.company?.name || '', searchTerm, 1.5);
        const descriptionResult = advancedMatch(job.description || '', searchTerm, 1.0);
        const jobTypeResult = advancedMatch(job.job_type || '', searchTerm, 1.2);
        
        // Enhanced skills matching
        let skillsResult = { score: 0, hasMatch: false, coverage: 0 };
        if (job.skills && job.skills.length > 0) {
            const skillsText = job.skills.map((skill: any) => 
                typeof skill === 'string' ? skill : skill?.name || ''
            ).join(' ');
            skillsResult = advancedMatch(skillsText, searchTerm, 2.0);
        }
        
        // Calculate total relevance score
        const totalScore = titleResult.score + categoryResult.score + companyResult.score + 
                         descriptionResult.score + jobTypeResult.score + skillsResult.score;
        
        // Determine if job is relevant
        const hasHighPriorityMatch = titleResult.score >= 6 || categoryResult.score >= 5 || skillsResult.score >= 4;
        const hasMultipleLowPriorityMatches = [companyResult, descriptionResult, jobTypeResult]
            .filter(result => result.hasMatch).length >= 2;
        const hasVeryHighScore = totalScore >= 8;
        
        const isRelevant = hasHighPriorityMatch || hasMultipleLowPriorityMatches || hasVeryHighScore;
        
        // Store score for potential sorting
        if (isRelevant) {
            (job as any)._searchScore = totalScore;
            (job as any)._searchDetails = {
                title: titleResult,
                category: categoryResult,
                company: companyResult,
                description: descriptionResult,
                jobType: jobTypeResult,
                skills: skillsResult,
                total: totalScore
            };
        }
        
        return isRelevant;
    })
    // Sort by relevance score (highest first)
    .sort((a: any, b: any) => {
        const scoreA = a._searchScore || 0;
        const scoreB = b._searchScore || 0;
        return scoreB - scoreA;
    });
};
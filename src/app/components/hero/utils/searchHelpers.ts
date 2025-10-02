import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

export const scrollToSearchResults = () => {
    setTimeout(() => {
        const searchResultsElement = document.getElementById('search-results');
        if (searchResultsElement) {
            searchResultsElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, 300);
};

export const createSearchQuery = (keyword: string, location: string): string => {
    return `query=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
};

export const handleSuggestionLogic = (
    suggestion: SearchSuggestion, 
    field: 'keyword' | 'location',
    currentKeyword: string,
    currentLocation: string
): { keyword: string; location: string } => {
    if (field === 'keyword') {
        if (suggestion.type === 'location') {
            return { keyword: '', location: suggestion.value };
        } else {
            return { keyword: suggestion.value, location: currentLocation };
        }
    } else if (field === 'location') {
        return { keyword: currentKeyword, location: suggestion.value };
    }
    return { keyword: currentKeyword, location: currentLocation };
};
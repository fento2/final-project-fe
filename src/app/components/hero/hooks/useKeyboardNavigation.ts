import { useRouter } from "next/navigation";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { createSearchQuery, scrollToSearchResults, handleSuggestionLogic } from "../utils/searchHelpers";

interface UseKeyboardNavigationProps {
    keyword: string;
    location: string;
    keywordSuggestions: SearchSuggestion[];
    locationSuggestions: SearchSuggestion[];
    showKeywordSuggestions: boolean;
    showLocationSuggestions: boolean;
    selectedKeywordIndex: number;
    selectedLocationIndex: number;
    setSelectedKeywordIndex: (index: number) => void;
    setSelectedLocationIndex: (index: number) => void;
    setShowKeywordSuggestions: (show: boolean) => void;
    setShowLocationSuggestions: (show: boolean) => void;
    handleSuggestionSelect: (suggestion: SearchSuggestion, field: 'keyword' | 'location') => void;
}

export const useKeyboardNavigation = ({
    keyword,
    location,
    keywordSuggestions,
    locationSuggestions,
    showKeywordSuggestions,
    showLocationSuggestions,
    selectedKeywordIndex,
    selectedLocationIndex,
    setSelectedKeywordIndex,
    setSelectedLocationIndex,
    setShowKeywordSuggestions,
    setShowLocationSuggestions,
    handleSuggestionSelect
}: UseKeyboardNavigationProps) => {
    const router = useRouter();

    const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
        if (!showKeywordSuggestions || keywordSuggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedKeywordIndex(
                    selectedKeywordIndex < keywordSuggestions.length - 1 ? selectedKeywordIndex + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedKeywordIndex(
                    selectedKeywordIndex > 0 ? selectedKeywordIndex - 1 : keywordSuggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedKeywordIndex >= 0) {
                    const suggestion = keywordSuggestions[selectedKeywordIndex];
                    handleSuggestionSelect(suggestion, 'keyword');
                    
                    setTimeout(() => {
                        const { keyword: searchKeyword, location: searchLocation } = 
                            handleSuggestionLogic(suggestion, 'keyword', keyword, location);
                        
                        const q = createSearchQuery(searchKeyword, searchLocation);
                        router.push(`/?${q}`);
                        scrollToSearchResults();
                    }, 100);
                }
                break;
            case 'Escape':
                setShowKeywordSuggestions(false);
                setSelectedKeywordIndex(-1);
                break;
        }
    };

    const handleLocationKeyDown = (e: React.KeyboardEvent) => {
        if (!showLocationSuggestions || locationSuggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedLocationIndex(
                    selectedLocationIndex < locationSuggestions.length - 1 ? selectedLocationIndex + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedLocationIndex(
                    selectedLocationIndex > 0 ? selectedLocationIndex - 1 : locationSuggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedLocationIndex >= 0) {
                    const suggestion = locationSuggestions[selectedLocationIndex];
                    handleSuggestionSelect(suggestion, 'location');
                    
                    setTimeout(() => {
                        const searchLocation = suggestion.value;
                        const q = createSearchQuery(keyword, searchLocation);
                        router.push(`/?${q}`);
                        scrollToSearchResults();
                    }, 100);
                }
                break;
            case 'Escape':
                setShowLocationSuggestions(false);
                setSelectedLocationIndex(-1);
                break;
        }
    };

    return { handleKeywordKeyDown, handleLocationKeyDown };
};
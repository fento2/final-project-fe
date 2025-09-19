import React from 'react';
import { SearchSuggestion } from '@/hooks/useSearchSuggestions';
import { MapPin, Briefcase, Search, Building, FileText } from 'lucide-react';

interface SuggestionDropdownProps {
    suggestions: SearchSuggestion[];
    onSelect: (suggestion: SearchSuggestion) => void;
    isVisible: boolean;
    selectedIndex?: number;
    className?: string;
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
    suggestions,
    onSelect,
    isVisible,
    selectedIndex = -1,
    className = ''
}) => {
    if (!isVisible || suggestions.length === 0) return null;

  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'category':
        return <Briefcase className="w-4 h-4" />;
      case 'company':
        return <Building className="w-4 h-4" />;
      case 'title':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'location':
                return 'Location';
            case 'category':
                return 'Category';
            case 'company':
                return 'Company';
            default:
                return 'Keyword';
        }
    };

    return (
        <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto ${className}`}>
            {suggestions.map((suggestion, index) => (
                <div
                    key={`${suggestion.type}-${suggestion.value}-${index}`}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        index === selectedIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelect(suggestion)}
                >
                    <div className="flex items-center space-x-3">
                        {getIcon(suggestion.type)}
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {suggestion.value}
                            </div>
                            <div className="text-xs text-gray-500">
                                {getTypeLabel(suggestion.type)}
                                {suggestion.count && ` • ${suggestion.count} jobs`}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestionDropdown;
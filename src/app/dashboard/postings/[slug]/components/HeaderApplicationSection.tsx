import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

interface HeaderApplicationProps {
    total: number;
    search: string;
    onSearchChange: (value: string) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
}

export const HeaderApplication: React.FC<HeaderApplicationProps> = ({
    total,
    search,
    onSearchChange,
    showFilters,
    onToggleFilters,
}) => {
    return (
        <>
            <CardHeader className="flex flex-col gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">
                        {total} Applicants Found
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Click on a card to view full details of each applicant
                    </p>
                </div>

                {/* Search */}
                <div className="relative flex items-center gap-2 w-full">
                    <Input
                        placeholder="Search applicant by name or email..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full py-5 !text-lg pl-12"
                    />
                    <Search className="absolute top-2 left-2 text-neutral-600" />
                </div>
            </CardHeader>

            <div className="border-t p-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {showFilters ? "Filters are visible" : "Expand filters to refine results"}
                </p>
                <Button variant="outline" size="sm" onClick={onToggleFilters}>
                    {showFilters ? (
                        <>
                            <ChevronUp className="h-4 w-4 mr-1" /> Hide Filters
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4 mr-1" /> Show Filters
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

export default HeaderApplication;

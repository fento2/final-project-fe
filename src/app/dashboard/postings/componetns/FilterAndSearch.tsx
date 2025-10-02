import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toTitleCase } from "@/helper/toTitleCase";
import { Search } from "lucide-react";
import { SetStateAction } from "react";
interface FilterAndSearchProps {
    search: string
    setSearch: (value: SetStateAction<string>) => void
    setCurrentPage: (value: SetStateAction<number>) => void
    showPreselection: boolean
    setShowPreselection: (value: SetStateAction<boolean>) => void
    showNotExpired: boolean
    setShowNotExpired: (value: SetStateAction<boolean>) => void
    category: string
    setCategory: (value: SetStateAction<string>) => void
    categories: string[]
    sort: string
    setSort: (value: SetStateAction<string>) => void
}
const FilterAndSearch = ({ search, setSearch, setCurrentPage, showPreselection, setShowPreselection, showNotExpired, setShowNotExpired, category, categories, setCategory, sort, setSort }: FilterAndSearchProps) => {
    return (
        <>
            {/* Search & Filters */}
            <div className="flex flex-col gap-4">
                {/* Search bar di atas */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                        placeholder="Search job..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10"
                    />
                </div>

                {/* Filters di bawah */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Checkbox filters */}
                    <div className="flex gap-4 lg:flex-row flex-col">
                        {/* Show Preselection */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-preselection"
                                checked={showPreselection}
                                className="w-5 h-5"
                                onCheckedChange={(checked) => {
                                    setShowPreselection(!!checked)
                                }}
                            />
                            <Label
                                htmlFor="show-preselection"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Only Show Preselection required
                            </Label>
                        </div>

                        {/* Show Not Expired */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-not-expired"
                                checked={showNotExpired}
                                className="w-5 h-5"
                                onCheckedChange={(checked) => setShowNotExpired(!!checked)}
                            />
                            <Label
                                htmlFor="show-not-expired"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Only Show Not Expired
                            </Label>
                        </div>
                    </div>

                    {/* Select filters */}
                    <div className="flex items-center gap-2 lg:flex-row flex-col">
                        {/* Category Select */}
                        <Select
                            value={category}
                            onValueChange={(v) => {
                                setCategory(v);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {toTitleCase(cat)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort Select */}
                        <Select value={sort} onValueChange={(v) => setSort(v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Desc</SelectItem>
                                <SelectItem value="asc">Asc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    )
}
export default FilterAndSearch
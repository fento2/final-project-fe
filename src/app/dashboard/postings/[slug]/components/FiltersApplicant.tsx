import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toTitleCase } from "@/helper/toTitleCase";
import { Status } from "../applicant/components/ApplicantAction";

type ApplicantFilterProps = {
    minAge: string;
    setMinAge: (val: string) => void;
    maxAge: string;
    setMaxAge: (val: string) => void;
    minSalary: string;
    setMinSalary: (val: string) => void;
    maxSalary: string;
    setMaxSalary: (val: string) => void;
    education: string;
    setEducation: (val: string) => void;
    gender: string
    setGender: (val: string) => void
    status: string
    setStatus: (val: string) => void
    sortBy: string;
    setSortBy: (val: string) => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (val: "asc" | "desc") => void;
};

const ApplicantFilter = ({
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    minSalary,
    setMinSalary,
    maxSalary,
    setMaxSalary,
    education,
    setEducation,
    sortBy,
    setSortBy,
    gender,
    setGender,
    status,
    setStatus,
    sortOrder,
    setSortOrder,

}: ApplicantFilterProps) => {
    return (
        <div className="p-4 border-t bg-muted/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            <div>
                <label className="block text-sm font-medium mb-1">Minimum Age</label>
                <Input
                    type="number"
                    placeholder="e.g. 21"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Maximum Age</label>
                <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Minimum Salary</label>
                <Input
                    type="number"
                    placeholder="e.g. 3000000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Maximum Salary</label>
                <Input
                    type="number"
                    placeholder="e.g. 7000000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {[Status.SUBMITTED, Status.INTERVIEW, Status.ACCEPTED, Status.REJECTED].map((v, idx) => (
                            <SelectItem key={idx} value={v}>
                                {toTitleCase(v)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        {["all", "MALE", "FEMALE"].map((v) => (
                            <SelectItem key={v} value={v}>
                                {toTitleCase(v)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Education</label>
                <Select value={education} onValueChange={setEducation}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                        {["all", "HIGH_SCHOOL", "DIPLOMA", "BACHELOR", "MASTER", "DOCTORATE"].map((v) => (
                            <SelectItem key={v} value={v}>
                                {toTitleCase(v)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort field" />
                    </SelectTrigger>
                    <SelectContent>
                        {["appliedOn", "score", "age", "expected_salary"].map((v, idx) => (
                            <SelectItem key={v} value={v}>
                                {idx === 0 ? "Applied On" : toTitleCase(v)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                    {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
                </Button>
            </div>
        </div>
    );
};

export default ApplicantFilter;

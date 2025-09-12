"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Edit2,
    FileText,
    ChevronDown,
    ChevronUp,
    Search,
} from "lucide-react";

const ApplicantSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filters & Sorting State
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "appliedAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
        (searchParams.get("sortOrder") as "asc" | "desc") || "asc"
    );
    const [showFilters, setShowFilters] = useState(false);

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [minAge, setMinAge] = useState(searchParams.get("minAge") || "");
    const [maxAge, setMaxAge] = useState(searchParams.get("maxAge") || "");
    const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");
    const [maxSalary, setMaxSalary] = useState(searchParams.get("maxSalary") || "");
    const [education, setEducation] = useState(searchParams.get("education") || "all");

    // Dummy data (TODO: fetch API)
    const applicants = [
        {
            name: "John Doe",
            email: "john@example.com",
            status: "Pending",
            score: 85,
            appliedAt: "2025-09-10",
            cvUrl: "/cv/john.pdf",
            expectedSalary: 5000000,
            age: 25,
            education: "Bachelor",
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            status: "Accepted",
            score: 92,
            appliedAt: "2025-09-09",
            cvUrl: "/cv/jane.pdf",
            expectedSalary: 7000000,
            age: 28,
            education: "Master",
        },
    ];

    // 🔗 Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (minAge) params.set("minAge", minAge);
        if (maxAge) params.set("maxAge", maxAge);
        if (minSalary) params.set("minSalary", minSalary);
        if (maxSalary) params.set("maxSalary", maxSalary);
        if (education !== "all") params.set("education", education);
        if (status !== "all") params.set("status", status);
        if (sortBy) params.set("sortBy", sortBy);
        if (sortOrder) params.set("sortOrder", sortOrder);
        router.replace(`?${params.toString()}`);
    }, [q, minAge, maxAge, minSalary, maxSalary, education, status, sortBy, sortOrder]);

    // 🧮 Apply filters
    const filteredApplicants = useMemo(() => {
        return applicants.filter((app) => {
            const matchName =
                !q ||
                app.name.toLowerCase().includes(q.toLowerCase()) ||
                app.email.toLowerCase().includes(q.toLowerCase());

            const matchStatus = status === "all" || app.status === status;
            const matchEducation = education === "all" || app.education === education;
            const matchAge =
                (!minAge || app.age >= Number(minAge)) &&
                (!maxAge || app.age <= Number(maxAge));
            const matchSalary =
                (!minSalary || app.expectedSalary >= Number(minSalary)) &&
                (!maxSalary || app.expectedSalary <= Number(maxSalary));

            return matchName && matchStatus && matchEducation && matchAge && matchSalary;
        });
    }, [q, status, education, minAge, maxAge, minSalary, maxSalary, applicants]);

    const sortedApplicants = useMemo(() => {
        return [...filteredApplicants].sort((a, b) => {
            let valA: any = a[sortBy as keyof typeof a];
            let valB: any = b[sortBy as keyof typeof b];

            if (sortBy === "appliedAt") {
                valA = new Date(a.appliedAt).getTime();
                valB = new Date(b.appliedAt).getTime();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredApplicants, sortBy, sortOrder]);

    return (
        <Card className="lg:col-span-1 order-3 lg:order-2">
            <CardHeader className="flex flex-col gap-4">
                <CardTitle className="text-center">
                    Applicants ({filteredApplicants.length})
                </CardTitle>

                {/* 🔍 Search Bar */}
                <div className="flex items-center gap-2 w-full">
                    <Input
                        placeholder="Search applicant by name or email..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full"
                    />
                    <Button variant="secondary" size="sm">
                        <Search className="h-4 w-4 mr-1" /> Search
                    </Button>
                </div>
            </CardHeader>

            {/* Footer Controls */}
            <div className="border-t p-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {showFilters
                        ? "Filters are visible"
                        : "Expand filters to refine results"}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                >
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

            {/* Collapsible Filters */}
            {showFilters && (
                <div className="p-4 border-t bg-muted/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Minimum Age</label>
                        <Input
                            type="number"
                            placeholder="e.g. 21"
                            value={minAge}
                            onChange={(e) => setMinAge(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Maximum Age</label>
                        <Input
                            type="number"
                            placeholder="e.g. 30"
                            value={maxAge}
                            onChange={(e) => setMaxAge(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Minimum Salary</label>
                        <Input
                            type="number"
                            placeholder="e.g. 3000000"
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Maximum Salary</label>
                        <Input
                            type="number"
                            placeholder="e.g. 7000000"
                            value={maxSalary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Education</label>
                        <Select value={education} onValueChange={setEducation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select education" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="HighSchool">High School</SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="Bachelor">Bachelor</SelectItem>
                                <SelectItem value="Master">Master</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Application Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort By</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort field" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="appliedAt">Applied Date</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="score">Score</SelectItem>
                                <SelectItem value="age">Age</SelectItem>
                                <SelectItem value="expectedSalary">Expected Salary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort Order</label>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                            }
                        >
                            {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
                        </Button>
                    </div>
                </div>
            )}

            {/* 📋 Applicant List */}
            <CardContent className="overflow-y-auto max-h-[650px] thin-scrollbar">
                <div className="space-y-4">
                    {sortedApplicants.map((app, idx) => (
                        <div
                            key={idx}
                            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow"
                        >
                            {/* Info */}
                            <div className="mb-3 md:mb-0">
                                <h3 className="font-semibold text-lg">{app.name}</h3>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                                <p className="text-sm">
                                    Status: <span className="font-medium">{app.status}</span>
                                </p>
                                <p className="text-sm">
                                    Score: <span className="font-medium">{app.score}</span>
                                </p>
                                <p className="text-sm">
                                    Expected Salary:{" "}
                                    <span className="font-medium">
                                        Rp {app.expectedSalary.toLocaleString()}
                                    </span>
                                </p>
                                <p className="text-sm">
                                    Age: <span className="font-medium">{app.age}</span>
                                </p>
                                <p className="text-sm">
                                    Education: <span className="font-medium">{app.education}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Applied on {app.appliedAt}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap md:flex-col">
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={app.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1"
                                    >
                                        <FileText size={16} /> CV
                                    </a>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Edit2 size={16} /> Update
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>


        </Card>
    );
};

export default ApplicantSection;

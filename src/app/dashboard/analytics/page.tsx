"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { apiCall } from "@/helper/apiCall";

interface AgeData {
    range: string;
    count: number;
}

const AnalyticsPage = () => {
    const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
    const [rangeFilter, setRangeFilter] = useState<"7d" | "month" | "year" | "all">("7d");
    const [ageData, setAgeData] = useState<AgeData[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserAge = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (genderFilter !== "all") params.gender = genderFilter;
            if (rangeFilter) params.range = rangeFilter;

            const { data } = await apiCall.get("/analytic/user-age/", { params });
            setAgeData(data.data.ageData);
            setTotalUsers(data.data.total);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch setiap kali filter berubah
    useEffect(() => {
        fetchUserAge();
    }, [genderFilter, rangeFilter]);

    return (
        <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6 space-y-6">
            <h1 className="text-2xl font-bold">Website Analytics</h1>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6">
                    {/* Gender Filter */}
                    <div>
                        <Label className="mb-2 block">Gender</Label>
                        <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val as "all" | "male" | "female")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Range Filter */}
                    <div>
                        <Label className="mb-2 block">Time Range</Label>
                        <Select value={rangeFilter} onValueChange={(val) => setRangeFilter(val as "7d" | "month" | "year" | "all")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* User Demographics */}
            <Card>
                <CardHeader>
                    <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageData}>
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                    <p className="mt-2 font-semibold">Total Users: {totalUsers}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsPage;

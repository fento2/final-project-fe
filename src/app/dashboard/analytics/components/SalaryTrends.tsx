"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { toTitleCase } from "@/helper/toTitleCase";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Label as RechartsLabel,
} from "recharts";
import LoadingCard from "./LoadingCard";
import SelectFilter from "./SelectFilter";

enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    INTERNSHIP = "INTERNSHIP",
    FREELANCE = "FREELANCE",
    CONTRACT = " CONTRACT",
    TEMPORARY = "TEMPORARY",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID"
}

interface SalaryData {
    category: string;
    avgSalary: number;
}

const SalaryTrends = () => {
    const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
    const [loadingSalary, setLoadingSalary] = useState<boolean>(false);

    // filter state
    const [jobType, setJobType] = useState<JobType | "all">("all");
    const [range, setRange] = useState<"7d" | "month" | "year" | "all">("7d");
    const [filterCity, setFilterCity] = useState('all')
    const [cities, setCities] = useState([])

    // fetch salary trends
    const fetchSalaryTrends = async () => {
        try {
            setLoadingSalary(true);
            const { data } = await apiCall.get("/analytic/salary-trends", {
                params: {
                    jobType,
                    range,
                    city: filterCity
                },
            });
            if (data.success) {
                const salary = data.data.result.map((d: SalaryData) => ({
                    category: toTitleCase(d.category),
                    avgSalary: Math.ceil(d.avgSalary),
                }));
                setSalaryData(salary);
                setCities(data.data.cities)
                console.log(data)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSalary(false);
        }
    };

    useEffect(() => {
        fetchSalaryTrends();
    }, [jobType, range, filterCity]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <CardTitle>Salary Trends</CardTitle>
                </div>
                <CardDescription>
                    Analisis rata-rata gaji berdasarkan kategori pekerjaan.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 border-neutral-100 border-b pb-4">
                    <SelectFilter value={jobType} setValue={setJobType} placeHolder="Pilih tipe pekerjaan" valueArray={['all', ...Object.values(JobType)]} label="Job type" />

                    <SelectFilter value={filterCity} setValue={setFilterCity} label="City" placeHolder="Select city" valueArray={['all', ...cities]} />

                    <SelectFilter label="Time Range" value={range} setValue={setRange} placeHolder="Pilih range waktu" valueArray={['7d', 'month', 'year', 'all']} />
                </div>

                {/* Chart / Loading / Empty State */}
                {loadingSalary ? (
                    <LoadingCard />
                ) : salaryData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada data untuk filter ini.
                    </p>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height={350}
                        className="bg-neutral-50 rounded-lg"
                    >
                        <BarChart
                            data={salaryData}
                            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                            <XAxis dataKey="category">
                                <RechartsLabel
                                    value="Job Category"
                                    offset={-20}
                                    position="insideBottom"
                                    style={{
                                        fill: "oklch(87.9% 0.169 91.605)",
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                />
                            </XAxis>
                            <YAxis
                                tickFormatter={(value: number) => {
                                    if (value >= 1_000_000) {
                                        return `Rp${(value / 1_000_000).toFixed(1)}Jt`;
                                    } else if (value >= 1_000) {
                                        return `Rp${(value / 1_000).toFixed(1)}Rb`;
                                    }
                                    return `Rp${value}`;
                                }}
                            >
                            </YAxis>
                            <Tooltip
                                formatter={(value: number) =>
                                    `Rp ${value.toLocaleString("id-ID")}`
                                }
                            />
                            <Bar
                                dataKey="avgSalary"
                                fill="oklch(76.9% 0.188 70.08)"
                                // barSize={60}
                                name="Average Salary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default SalaryTrends;

'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall } from "@/helper/apiCall"
import { toTitleCase } from "@/helper/toTitleCase"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Label as RechartsLabel, PieChart, Pie, Legend, Cell, ResponsiveContainer, } from "recharts"
import LoadingCard from "./LoadingCard"
import LoadingPieChart from "./LoadingPieChart"
import SelectFilter from "./SelectFilter"
import GeneralBarChart from "./GeneralBarChart"
interface AgeData {
    range: string;
    count: number;
}
interface LocationData {
    city: string;
    count: number;
}
const UserDemographics = () => {
    const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
    const [rangeFilter, setRangeFilter] = useState<"7d" | "month" | "year" | "all">("7d");

    const [ageData, setAgeData] = useState<AgeData[]>([]);
    const [locationData, setLocationData] = useState<LocationData[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserDemographics = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (genderFilter !== "all") params.set("gender", genderFilter);
            params.set("range", rangeFilter);

            const { data } = await apiCall.get(`/analytic/user-demographics?${params.toString()}`);
            if (data.success) {
                setAgeData(data.data.ageData);
                setLocationData(data.data.locationData);
                setTotalUsers(data.data.total);

            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const RADIAN = Math.PI / 180;
    const COLUR = ["oklch(70.7% 0.165 254.624)", "oklch(69.6% 0.17 162.48)", "oklch(87.9% 0.169 91.605)", "oklch(64.6% 0.222 41.116)", "oklch(51.4% 0.222 16.935)", "oklch(43.9% 0 0)"]

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        // Kalau persen = 0 → jangan render apa2
        if (!percent || percent === 0) return null;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-lg"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        fetchUserDemographics();

    }, [genderFilter, rangeFilter]);

    return (
        <>
            {/* User Demographics */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle>User Demographics</CardTitle>
                    </div>
                    <CardDescription>
                        Lihat distribusi pengguna berdasarkan gender dan rentang waktu yang dipilih.
                        Data ditampilkan dalam bentuk chart usia dan lokasi.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-2 border-neutral-100 border-b pb-4">
                        {/* Gender Filter */}
                        <SelectFilter value={genderFilter} setValue={setGenderFilter} placeHolder="Select gender" valueArray={['all', 'male', 'female']} label="Gender" />
                        {/* Range Filter */}
                        <SelectFilter label="Time Range" value={rangeFilter} setValue={setRangeFilter} placeHolder="Select range" valueArray={['7d', 'month', 'year', 'all']} />
                    </div>

                    {/* Charts */}
                    <div className="grid lg:grid-cols-4 grid-cols-1 gap-2">
                        <div className="lg:col-span-1 bg-neutral-50 rounded-lg p-4">

                            <h2 className="text-lg font-bold text-center mb-2">Applicant Age Distribution</h2>

                            {/* Chart Age */}
                            {loading ? (
                                <LoadingPieChart />
                            ) : (
                                <div className="grid lg:grid-cols-4 md:grid-cols-7 grid-cols-3 items-center">
                                    <ul className="flex flex-col gap-2 col-span-1">
                                        {ageData.map((entry, index) => (
                                            <li key={index} className="flex items-center gap-2 text-xs">
                                                <span
                                                    className="w-3 h-3 inline-block rounded"
                                                    style={{ backgroundColor: COLUR[index % COLUR.length] }}
                                                />
                                                {entry.range} Age
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="lg:col-span-3 md:col-span-6 col-span-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={ageData as any}
                                                    dataKey="count"
                                                    nameKey="range"
                                                    cx="50%"
                                                    cy="50%"
                                                    label={renderCustomizedLabel}
                                                    labelLine={false}
                                                >
                                                    {ageData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLUR[index % COLUR.length]}
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value: number, name: string, entry: any) => [
                                                        `${value} Applicant`,
                                                        `${entry.payload.range} Age`,
                                                    ]}
                                                />
                                            </PieChart>

                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-3 h-[350px] lg:h-full">
                            {/* Chart Location */}
                            {loading ? (
                                <LoadingCard />
                            ) : (
                                <GeneralBarChart
                                    data={locationData}
                                    height={'100%'}
                                    dataKeyX="city" label="City"
                                    colorLabel="oklch(69.6% 0.17 162.48)"
                                    dataKeyBar="count"
                                    colorBar="oklch(69.6% 0.17 162.48)"
                                />
                            )}
                        </div>
                    </div>

                    <p className="mt-2 font-semibold">Total Users: {totalUsers}</p>
                </CardContent>
            </Card >
        </>
    )
}
export default UserDemographics
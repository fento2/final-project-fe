import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { months, years } from "@/helper/profileHelper";

interface DateFormProps {
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
    setField: (field: "startMonth" | "startYear" | "endMonth" | "endYear", value: string | number) => void;
}

const DateForm = ({ startMonth, startYear, endMonth, endYear, setField }: DateFormProps) => {
    return (
        <>
            {/* Start Date */}
            <div className="space-y-1">
                <Label>Start Date</Label>
                <div className="flex gap-2">
                    <Select
                        value={startMonth}
                        onValueChange={(val) => setField("startMonth", val)}
                    >
                        <SelectTrigger className="w-1/2 text-lg py-6">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m, i) => (
                                <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={startYear.toString()}
                        onValueChange={(val) => setField("startYear", Number(val))}
                    >
                        <SelectTrigger className="w-1/2 text-lg py-6">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* End Date */}
            <div className="space-y-1">
                <Label>End Date</Label>
                <div className="flex gap-2">
                    <Select
                        value={endMonth || ""}
                        onValueChange={(val) => setField("endMonth", val)}
                    >
                        <SelectTrigger className="w-1/2 text-lg py-6">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m, i) => (
                                <SelectItem key={i} value={m} className="p-4 text-lg">{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={endYear?.toString() || ""}
                        onValueChange={(val) => setField("endYear", Number(val))}
                    >
                        <SelectTrigger className="w-1/2 text-lg py-6">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()} className="p-4 text-lg">{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
};

export default DateForm;

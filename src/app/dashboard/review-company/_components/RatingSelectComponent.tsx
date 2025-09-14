import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RatingSelectProps = {
    control: any;
    name: string;
    label: string;
};

const RatingSelect = ({ control, name, label }: RatingSelectProps) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
};

export default RatingSelect;
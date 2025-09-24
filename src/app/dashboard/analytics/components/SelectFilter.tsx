import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toTitleCase } from "@/helper/toTitleCase"

interface SelectFilterProps {
    value: any
    setValue: (val: any) => void
    valueArray: any[]
    placeHolder: string
    label: string
}
const SelectFilter = ({ value, setValue, valueArray, placeHolder, label }: SelectFilterProps) => {
    return (
        <>
            <div>
                <Label className="mb-2 block">{label}</Label>
                <Select
                    value={value}
                    onValueChange={(val) => setValue(val)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={placeHolder} />
                    </SelectTrigger>
                    {label !== 'Time Range' ? <SelectContent>
                        {valueArray.map((v, i) => (
                            <div key={i}>
                                {<SelectItem value={v}>{toTitleCase(v)}</SelectItem>}
                            </div>
                        ))}
                    </SelectContent> :
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    }
                </Select>
            </div>
        </>
    )
}
export default SelectFilter
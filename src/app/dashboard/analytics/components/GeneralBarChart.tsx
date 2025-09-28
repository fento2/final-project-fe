'use client'
import { toTitleCase } from "@/helper/toTitleCase"
import { Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


interface GeneralBarChartProps {
    data: any
    dataKeyX: string
    label: string
    dataKeyBar: string
    colorLabel: string
    colorBar: string
    height: string | number

}
const GeneralBarChart = ({ data, dataKeyBar, label, colorBar, dataKeyX, colorLabel, height }: GeneralBarChartProps) => {
    return <>
        <ResponsiveContainer width="100%" height={height} className={'bg-neutral-50 rounded-lg'}>
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                <XAxis dataKey={dataKeyX} tickFormatter={(v) => toTitleCase(v)} >
                    <Label
                        value={label}
                        offset={-20}
                        position="insideBottom"
                        style={{ fill: colorLabel, fontSize: 18, fontWeight: "bold" }}
                    />
                </XAxis>
                <YAxis
                    // domain={[0, 500]}          // batas min & max
                    tickCount={6}              // jumlah garis bantu
                // ticks={[0, 100, 200, 300, 400, 500]} // bisa custom manual juga
                >
                </YAxis>
                <Tooltip labelFormatter={(v) => toTitleCase(v)} />
                <Bar
                    dataKey={dataKeyBar}
                    fill={colorBar}
                // barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    </>
}
export default GeneralBarChart
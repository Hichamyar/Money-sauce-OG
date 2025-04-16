"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Feb",
    total: 1900,
  },
  {
    name: "Mar",
    total: 1500,
  },
  {
    name: "Apr",
    total: 2200,
  },
  {
    name: "May",
    total: 2800,
  },
  {
    name: "Jun",
    total: 2600,
  },
  {
    name: "Jul",
    total: 3100,
  },
  {
    name: "Aug",
    total: 3500,
  },
  {
    name: "Sep",
    total: 3200,
  },
  {
    name: "Oct",
    total: 3800,
  },
  {
    name: "Nov",
    total: 4100,
  },
  {
    name: "Dec",
    total: 4500,
  },
]

export function DashboardChart() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="total"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "var(--color-total)", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { useCurrencyFormatter } from "@/lib/format-currency"

export function SavingsComparisonChart() {
  const { theme } = useTheme()
  const { monthlyData, currency } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  // Get data for the last 6 months
  const getLastSixMonths = () => {
    const currentDate = new Date()
    const months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push(monthStr)
    }

    return months
  }

  const lastSixMonths = getLastSixMonths()

  // Format month for display (e.g., "2023-01" to "Jan 2023")
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Prepare chart data
  const chartData = lastSixMonths.map((month) => {
    const monthData = monthlyData.find((data) => data.month === month) || {
      projectedSavings: 0,
      actualSavings: 0,
    }

    return {
      name: formatMonth(month),
      Projected: monthData.projectedSavings,
      Actual: monthData.actualSavings,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" tick={{ fill: theme === "dark" ? "#888" : "#333" }} />
        <YAxis
          className="text-xs"
          tick={{ fill: theme === "dark" ? "#888" : "#333" }}
          tickFormatter={(value) => `${currency.symbol}${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
            border: "1px solid #ccc",
          }}
          formatter={(value) => [`${currency.symbol}${Number(value).toFixed(2)}`, undefined]}
        />
        <Legend />
        <Bar dataKey="Projected" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Actual" fill="#a78bfa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

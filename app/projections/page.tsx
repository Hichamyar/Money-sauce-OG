"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/finance-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"
import { ArrowRight } from "lucide-react"
import { useCurrencyFormatter } from "@/lib/format-currency"

export default function ProjectionsPage() {
  const { theme } = useTheme()
  const { monthlyData, incomeSources, expenses, getCurrentMonth, updateMonthlyData, currency } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  useEffect(() => {
    // Update current month data when component mounts
    updateMonthlyData(getCurrentMonth())
  }, [updateMonthlyData, getCurrentMonth])

  // Get data for the current month and future months
  const getMonthsForProjection = () => {
    const currentDate = new Date()
    const months = []

    // Include current month and 11 future months (1 year total)
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() + i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push(monthStr)
    }

    return months
  }

  // Get data for the past months
  const getPastMonths = () => {
    const currentDate = new Date()
    const months = []

    // Include 11 past months and current month (1 year total)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push(monthStr)
    }

    return months
  }

  const projectionMonths = getMonthsForProjection()
  const pastMonths = getPastMonths()

  // Format month for display (e.g., "2023-01" to "January 2023")
  const formatMonthLong = (month: string) => {
    const [year, monthNum] = month.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Format month for chart (e.g., "2023-01" to "Jan 2023")
  const formatMonthShort = (month: string) => {
    const [year, monthNum] = month.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Calculate projected data for future months
  const calculateProjections = () => {
    // Remove this line that was causing the error:
    // updateMonthlyData(getCurrentMonth())

    // Rest of the function remains the same...
    // Calculate monthly income
    const monthlyIncome = incomeSources.reduce((total, source) => {
      if (source.frequency === "monthly") return total + source.amount
      if (source.frequency === "weekly") return total + source.amount * 4.33
      if (source.frequency === "biweekly") return total + source.amount * 2.17
      if (source.frequency === "yearly") return total + source.amount / 12
      return total
    }, 0)

    // Calculate monthly expenses
    const monthlyExpenses = expenses.reduce((total, expense) => {
      if (expense.frequency === "monthly") return total + expense.amount
      if (expense.frequency === "weekly") return total + expense.amount * 4.33
      if (expense.frequency === "biweekly") return total + expense.amount * 2.17
      if (expense.frequency === "yearly") return total + expense.amount / 12
      return total
    }, 0)

    // Calculate monthly savings
    const monthlySavings = monthlyIncome - monthlyExpenses

    // Generate projection data
    return projectionMonths.map((month, index) => {
      const existingData = monthlyData.find((data) => data.month === month)

      if (existingData) {
        return {
          month: formatMonthShort(month),
          rawMonth: month,
          projectedIncome: existingData.projectedIncome,
          projectedExpenses: existingData.projectedExpenses,
          projectedSavings: existingData.projectedSavings,
          actualIncome: existingData.actualIncome,
          actualExpenses: existingData.actualExpenses,
          actualSavings: existingData.actualSavings,
        }
      }

      // For future months, use the calculated monthly values
      return {
        month: formatMonthShort(month),
        rawMonth: month,
        projectedIncome: monthlyIncome,
        projectedExpenses: monthlyExpenses,
        projectedSavings: monthlySavings,
        actualIncome: 0, // No actual data for future months
        actualExpenses: 0,
        actualSavings: 0,
      }
    })
  }

  // Generate historical data
  const generateHistoricalData = () => {
    return pastMonths.map((month) => {
      const existingData = monthlyData.find((data) => data.month === month)

      if (existingData) {
        return {
          month: formatMonthShort(month),
          rawMonth: month,
          income: existingData.actualIncome,
          expenses: existingData.actualExpenses,
          savings: existingData.actualSavings,
        }
      }

      // For months without data
      return {
        month: formatMonthShort(month),
        rawMonth: month,
        income: 0,
        expenses: 0,
        savings: 0,
      }
    })
  }

  const projectionData = calculateProjections()
  const historicalData = generateHistoricalData()

  // Find the selected month's data
  const selectedMonthData = monthlyData.find((data) => data.month === selectedMonth) || {
    month: selectedMonth,
    projectedIncome: 0,
    actualIncome: 0,
    projectedExpenses: 0,
    actualExpenses: 0,
    projectedSavings: 0,
    actualSavings: 0,
  }

  // Calculate cumulative savings over time
  const calculateCumulativeSavings = () => {
    let cumulativeSavings = 0

    return projectionData.map((data) => {
      cumulativeSavings += data.projectedSavings

      return {
        month: data.month,
        rawMonth: data.rawMonth,
        savings: cumulativeSavings,
      }
    })
  }

  const cumulativeSavingsData = calculateCumulativeSavings()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Projections</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Projections</CardTitle>
            <CardDescription>Projected income, expenses, and savings for the next 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: theme === "dark" ? "#888" : "#333" }} />
                <YAxis
                  className="text-xs"
                  tick={{ fill: theme === "dark" ? "#888" : "#333" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "#fff" : "#333",
                    border: "1px solid #ccc",
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
                />
                <Legend />
                <Bar dataKey="projectedIncome" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projectedExpenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projectedSavings" name="Savings" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Savings</CardTitle>
            <CardDescription>Projected cumulative savings over the next 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cumulativeSavingsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: theme === "dark" ? "#888" : "#333" }} />
                <YAxis
                  className="text-xs"
                  tick={{ fill: theme === "dark" ? "#888" : "#333" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "#fff" : "#333",
                    border: "1px solid #ccc",
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
                />
                <Bar dataKey="savings" name="Cumulative Savings" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Compare projected vs. actual figures for a specific month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="month-select">Select Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {projectionMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonthLong(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <p className="font-medium">Income</p>
                    <p className="font-medium">Expenses</p>
                    <p className="font-medium">Savings</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Projected</h4>
                    <p>{currencyFormatter.format(selectedMonthData.projectedIncome)}</p>
                    <p>{currencyFormatter.format(selectedMonthData.projectedExpenses)}</p>
                    <p>{currencyFormatter.format(selectedMonthData.projectedSavings)}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Actual</h4>
                    <p>{currencyFormatter.format(selectedMonthData.actualIncome)}</p>
                    <p>{currencyFormatter.format(selectedMonthData.actualExpenses)}</p>
                    <p>{currencyFormatter.format(selectedMonthData.actualSavings)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Savings Difference</h4>
                  <div className="flex items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Projected</span>
                        <span>Actual</span>
                      </div>
                      <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(0, (selectedMonthData.projectedSavings / Math.max(selectedMonthData.projectedSavings, selectedMonthData.actualSavings)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Projected</span>
                        <span>Actual</span>
                      </div>
                      <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{
                            width: `${Math.max(0, (selectedMonthData.actualSavings / Math.max(selectedMonthData.projectedSavings, selectedMonthData.actualSavings)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Savings Analysis</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This analysis compares your projected savings with actual savings for {formatMonthLong(selectedMonth)}
                  .
                </p>

                {selectedMonthData.actualSavings >= selectedMonthData.projectedSavings ? (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">On Track</h4>
                    <p className="text-sm">
                      Your actual savings are meeting or exceeding your projections. Keep up the good work!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <h4 className="font-medium text-amber-600 dark:text-amber-400 mb-2">Below Target</h4>
                    <p className="text-sm">
                      Your actual savings are below projections. Consider reviewing your expenses to get back on track.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tips to Improve</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Review your recurring expenses for potential savings</li>
                    <li>Look for opportunities to increase your income</li>
                    <li>Set specific savings goals for each month</li>
                    <li>Track your daily expenses to identify spending patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historical Trends</CardTitle>
          <CardDescription>Your financial history over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: theme === "dark" ? "#888" : "#333" }} />
              <YAxis
                className="text-xs"
                tick={{ fill: theme === "dark" ? "#888" : "#333" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                  color: theme === "dark" ? "#fff" : "#333",
                  border: "1px solid #ccc",
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" name="Savings" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

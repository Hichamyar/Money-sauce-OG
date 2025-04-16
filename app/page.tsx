"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, PiggyBank, TrendingUp } from "lucide-react"
import { useFinanceStore } from "@/lib/finance-store"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"
import { useCurrencyFormatter } from "@/lib/format-currency"

export default function Home() {
  const { theme } = useTheme()
  const { incomeSources, expenses, monthlyData, getCurrentMonth, updateMonthlyData, getMonthlyData, currency } =
    useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  const currentMonth = getCurrentMonth()
  const currentMonthData = getMonthlyData(currentMonth)

  useEffect(() => {
    // Update monthly data when component mounts
    updateMonthlyData(currentMonth)
  }, [updateMonthlyData, currentMonth])

  // Calculate total income
  const totalIncome = currentMonthData?.projectedIncome || 0

  // Calculate total expenses
  const totalExpenses = currentMonthData?.projectedExpenses || 0

  // Calculate savings
  const savings = currentMonthData?.projectedSavings || 0

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  // Get data for the next 6 months
  const getNextSixMonths = () => {
    const currentDate = new Date()
    const months = []

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() + i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push(monthStr)
    }

    return months
  }

  const nextSixMonths = getNextSixMonths()

  // Format month for display (e.g., "2023-01" to "Jan 2023")
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Calculate projected data for future months
  const calculateProjections = () => {
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
    return nextSixMonths.map((month) => {
      const existingData = monthlyData.find((data) => data.month === month)

      if (existingData) {
        return {
          month: formatMonth(month),
          Income: existingData.projectedIncome,
          Expenses: existingData.projectedExpenses,
          Savings: existingData.projectedSavings,
        }
      }

      // For future months, use the calculated monthly values
      return {
        month: formatMonth(month),
        Income: monthlyIncome,
        Expenses: monthlyExpenses,
        Savings: monthlySavings,
      }
    })
  }

  const projectionData = calculateProjections()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your Finances
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Track your income, manage expenses, and watch your savings grow with Hicham's money sauce.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button className="px-8">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Dashboard */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Financial Overview</h2>

          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currencyFormatter.format(totalIncome)}</div>
                <p className="text-xs text-muted-foreground">
                  {incomeSources.length} income source{incomeSources.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currencyFormatter.format(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">
                  {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currencyFormatter.format(savings)}</div>
                <p className="text-xs text-muted-foreground">
                  {savings >= 0 ? (
                    <span className="text-emerald-500">Positive savings</span>
                  ) : (
                    <span className="text-rose-500">Negative savings</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {savingsRate >= 20 ? (
                    <span className="text-emerald-500">Excellent</span>
                  ) : savingsRate >= 10 ? (
                    <span className="text-amber-500">Good</span>
                  ) : (
                    <span className="text-rose-500">Needs improvement</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Basic Projections */}
          <h2 className="text-2xl font-bold tracking-tight mb-6">6-Month Projection</h2>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: theme === "dark" ? "#888" : "#333" }} />
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
                  <Bar dataKey="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Savings" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button size="lg">View Full Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

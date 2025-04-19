"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/finance-store"
import { useCurrencyFormatter } from "@/lib/format-currency"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths } from "date-fns"
import { PiggyBank, Wallet, TrendingUp, ArrowDown } from "lucide-react"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DataPage() {
  const {
    expenseCategories,
    expenses,
    incomeSources,
    getCategoryExpenses,
    getTotalBudget,
    getTotalSpent,
    getCurrentMonth,
  } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()
  const [mounted, setMounted] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Get past 12 months for the selector
  const getPastMonths = () => {
    const months = []
    const now = new Date()

    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push({
        value: monthStr,
        label: format(date, "MMMM yyyy"),
      })
    }

    return months
  }

  const pastMonths = getPastMonths()

  // Calculate key metrics for the selected month
  const totalBudget = getTotalBudget(selectedMonth)
  const totalSpent = getTotalSpent(selectedMonth)

  // Calculate total income for the selected month
  const totalIncome = incomeSources.reduce((total, source) => {
    // Skip one-time income from different months
    if (source.frequency === "one-time") {
      if (source.date && source.date.startsWith(selectedMonth)) {
        return total + source.amount
      }
      return total
    }

    // Skip recurring income that hasn't started yet
    if (source.startDate && source.startDate > selectedMonth) {
      return total
    }

    if (source.frequency === "monthly") {
      return total + source.amount
    }
    if (source.frequency === "yearly") {
      return total + source.amount / 12
    }
    if (source.frequency === "weekly") {
      return total + source.amount * 4.33
    }
    if (source.frequency === "biweekly") {
      return total + source.amount * 2.17
    }
    return total
  }, 0)

  const totalSaved = totalIncome - totalSpent

  // Prepare data for the pie chart
  const pieChartData = expenseCategories
    .map((category) => {
      const spent = getCategoryExpenses(category.id, selectedMonth)
      return {
        name: category.name,
        value: spent,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  // Prepare data for the monthly overview chart
  const getMonthlyChartData = () => {
    return pastMonths
      .map((month) => {
        const spent = getTotalSpent(month.value)
        const income = incomeSources.reduce((total, source) => {
          // Skip one-time income from different months
          if (source.frequency === "one-time") {
            if (source.date && source.date.startsWith(month.value)) {
              return total + source.amount
            }
            return total
          }

          // Skip recurring income that hasn't started yet
          if (source.startDate && source.startDate > month.value) {
            return total
          }

          if (source.frequency === "monthly") {
            return total + source.amount
          }
          if (source.frequency === "yearly") {
            return total + source.amount / 12
          }
          if (source.frequency === "weekly") {
            return total + source.amount * 4.33
          }
          if (source.frequency === "biweekly") {
            return total + source.amount * 2.17
          }
          return total
        }, 0)

        return {
          name: format(new Date(month.value + "-01"), "MMM"),
          Spent: spent,
          Income: income,
          Saved: income - spent,
        }
      })
      .reverse() // Show oldest to newest
  }

  const monthlyChartData = getMonthlyChartData()

  // Prepare data for the breakdown table
  const breakdownData = expenseCategories
    .map((category) => {
      const budget = category.budget || 0
      const spent = getCategoryExpenses(category.id, selectedMonth)
      const percentUsed = budget > 0 ? (spent / budget) * 100 : 0

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        budget,
        spent,
        percentUsed,
        trend: percentUsed >= 100 ? "over" : percentUsed >= 80 ? "warning" : "good",
      }
    })
    .sort((a, b) => b.spent - a.spent) // Sort by highest spent first

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Data</h1>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {pastMonths.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budgeted</p>
                <h3 className="text-2xl font-bold">{currencyFormatter.format(totalBudget)}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Spent</p>
                <h3 className="text-2xl font-bold">{currencyFormatter.format(totalSpent)}</h3>
              </div>
              <div className="p-2 bg-destructive/10 rounded-full">
                <ArrowDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Income</p>
                <h3 className="text-2xl font-bold">{currencyFormatter.format(totalIncome)}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saved</p>
                <h3 className="text-2xl font-bold">{currencyFormatter.format(totalSaved)}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <PiggyBank className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Expenses by Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [currencyFormatter.format(value as number), "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No expense data available for this month</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your financial trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [currencyFormatter.format(value as number), ""]} />
                    <Legend />
                    <Bar dataKey="Income" fill="#4ade80" />
                    <Bar dataKey="Spent" fill="#f87171" />
                    <Bar dataKey="Saved" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed breakdown of your budget categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budgeted</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>% Used</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdownData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{currencyFormatter.format(item.budget)}</TableCell>
                  <TableCell>{currencyFormatter.format(item.spent)}</TableCell>
                  <TableCell>{item.percentUsed.toFixed(1)}%</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          item.trend === "over"
                            ? "bg-red-500"
                            : item.trend === "warning"
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <span
                        className={
                          item.trend === "over"
                            ? "text-red-500"
                            : item.trend === "warning"
                              ? "text-amber-500"
                              : "text-green-500"
                        }
                      >
                        {item.trend === "over" ? "Over Budget" : item.trend === "warning" ? "Near Limit" : "Good"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/finance-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar } from "lucide-react"
import { subMonths } from "date-fns"
import { MonthCycleIndicator } from "@/components/month-cycle-indicator"
import { useCurrencyFormatter } from "@/lib/format-currency"

export default function DetailsPage() {
  const { expenses, expenseCategories, incomeSources, monthlyData, getCurrentMonth } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Get data for the past months
  const getPastMonths = () => {
    const currentDate = new Date()
    const months = []

    // Include 11 past months and current month (1 year total)
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(currentDate, i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      months.push(monthStr)
    }

    return months
  }

  const pastMonths = getPastMonths()

  // Format month for display (e.g., "2023-01" to "January 2023")
  const formatMonthLong = (month: string) => {
    const [year, monthNum] = month.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = expenseCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  // Get category color by ID
  const getCategoryColor = (categoryId: string) => {
    const category = expenseCategories.find((cat) => cat.id === categoryId)
    return category ? category.color : "#CCCCCC"
  }

  // Filter expenses by category and search query
  const getFilteredExpenses = (month: string) => {
    return expenses
      .filter((expense) => {
        // For one-time expenses, check if they occur in this month
        if (expense.frequency === "one-time") {
          return expense.date && expense.date.startsWith(month)
        }

        // For recurring expenses, check if they've started by this month
        if (expense.startDate) {
          return expense.startDate <= month
        }

        // For expenses without a startDate, assume they're active for all months
        return true
      })
      .filter((expense) => {
        // Apply category filter
        if (selectedCategory !== "all" && expense.categoryId !== selectedCategory) {
          return false
        }

        // Apply search filter
        if (searchQuery && !expense.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }

        return true
      })
  }

  // Calculate monthly equivalent for different frequencies
  const calculateMonthlyAmount = (expense: any) => {
    switch (expense.frequency) {
      case "monthly":
        return expense.amount
      case "weekly":
        return expense.amount * 4.33
      case "biweekly":
        return expense.amount * 2.17
      case "yearly":
        return expense.amount / 12
      case "one-time":
        return expense.amount // For one-time expenses, show the full amount
      default:
        return expense.amount
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial History</h2>
      </div>

      {/* Month Cycle Indicator */}
      <MonthCycleIndicator />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter History</CardTitle>
          <CardDescription>Narrow down your financial history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-query">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-query"
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly History */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pastMonths.map((month) => {
          const filteredExpenses = getFilteredExpenses(month)
          const monthData = monthlyData.find((data) => data.month === month)

          return (
            <Card key={month} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {formatMonthLong(month)}
                </CardTitle>
                {monthData && (
                  <CardDescription>
                    Income: {currencyFormatter.format(monthData.actualIncome)} | Expenses:{" "}
                    {currencyFormatter.format(monthData.actualExpenses)} | Savings:{" "}
                    {currencyFormatter.format(monthData.actualSavings)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {filteredExpenses.length > 0 ? (
                  <div className="divide-y">
                    {filteredExpenses.map((expense) => (
                      <div key={expense.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{expense.name}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <div
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                              ></div>
                              {getCategoryName(expense.categoryId)}
                              <span className="mx-1">•</span>
                              {expense.frequency === "one-time" ? "One-time" : expense.frequency}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{currencyFormatter.format(expense.amount)}</div>
                            {expense.frequency !== "one-time" && (
                              <div className="text-xs text-muted-foreground">
                                {currencyFormatter.format(calculateMonthlyAmount(expense))}/mo
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    {searchQuery || selectedCategory !== "all"
                      ? "No matching expenses found"
                      : "No expenses recorded for this month"}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

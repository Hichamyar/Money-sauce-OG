"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Plus, DollarSign, PiggyBank, CreditCard, TrendingUp } from "lucide-react"
import { useFinanceStore } from "@/lib/finance-store"
import { FinancialOverviewChart } from "@/components/financial-overview-chart"
import { ExpenseCategoryChart } from "@/components/expense-category-chart"
import { SavingsComparisonChart } from "@/components/savings-comparison-chart"
import { MonthCycleIndicator } from "@/components/month-cycle-indicator"
import { useCurrencyFormatter } from "@/lib/format-currency"
import Link from "next/link"

export default function DashboardPage() {
  const {
    incomeSources,
    expenses,
    expenseCategories,
    monthlyData,
    getCurrentMonth,
    updateMonthlyData,
    getMonthlyData,
    currency,
  } = useFinanceStore()

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/income">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Income
            </Button>
          </Link>
        </div>
      </div>

      {/* Month Cycle Indicator */}
      <MonthCycleIndicator />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-xs text-muted-foreground flex items-center">
                  {savings >= 0 ? (
                    <span className="text-emerald-500 flex items-center">
                      Positive savings <ArrowUpRight className="h-3 w-3 ml-1" />
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center">
                      Negative savings <ArrowDownRight className="h-3 w-3 ml-1" />
                    </span>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Your income and expenses for the current month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <FinancialOverviewChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseCategoryChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {expenseCategories.map((category) => {
                  const categoryExpenses = expenses.filter((e) => e.categoryId === category.id)
                  const categoryTotal = categoryExpenses.reduce((sum, e) => {
                    if (e.frequency === "monthly") return sum + e.amount
                    if (e.frequency === "yearly") return sum + e.amount / 12
                    if (e.frequency === "weekly") return sum + e.amount * 4.33
                    if (e.frequency === "biweekly") return sum + e.amount * 2.17
                    return sum
                  }, 0)

                  const percentOfTotal = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{currencyFormatter.format(categoryTotal)}</div>
                          <div className="text-xs text-muted-foreground">{percentOfTotal.toFixed(1)}% of total</div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentOfTotal}%`,
                            backgroundColor: category.color,
                            minWidth: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 text-center">
                <Link href="/expenses">
                  <Button variant="outline">Manage Expenses</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Comparison</CardTitle>
              <CardDescription>Projected vs. actual savings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsComparisonChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Tips</CardTitle>
              <CardDescription>Ways to increase your savings rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Follow the 50/30/20 Rule</h4>
                    <p className="text-sm text-muted-foreground">
                      Allocate 50% of your income to needs, 30% to wants, and 20% to savings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Review Subscriptions</h4>
                    <p className="text-sm text-muted-foreground">
                      Cancel unused subscriptions and services to reduce monthly expenses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Automate Your Savings</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up automatic transfers to your savings account on payday.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

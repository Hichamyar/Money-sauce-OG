"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { useCurrencyFormatter } from "@/lib/format-currency"

export function ExpenseCategoryChart() {
  const { theme } = useTheme()
  const { expenses, expenseCategories, currency } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  // Calculate total expenses by category
  const expensesByCategory = expenseCategories
    .map((category) => {
      const categoryExpenses = expenses.filter((e) => e.categoryId === category.id)
      const total = categoryExpenses.reduce((sum, e) => {
        if (e.frequency === "monthly") return sum + e.amount
        if (e.frequency === "yearly") return sum + e.amount / 12
        if (e.frequency === "weekly") return sum + e.amount * 4.33
        if (e.frequency === "biweekly") return sum + e.amount * 2.17
        return sum
      }, 0)

      return {
        name: category.name,
        value: total,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  // If no expenses, show empty state
  if (expensesByCategory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-muted-foreground mb-2">No expenses recorded yet</p>
        <p className="text-sm text-muted-foreground">Add expenses to see your category breakdown</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={expensesByCategory}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {expensesByCategory.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${currency.symbol}${Number(value).toFixed(2)}`, undefined]}
          contentStyle={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
            border: "1px solid #ccc",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

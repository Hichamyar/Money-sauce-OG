"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type IncomeSource = {
  id: string
  name: string
  amount: number
  frequency: "monthly" | "weekly" | "biweekly" | "yearly" | "one-time"
  date?: string // For one-time income
  startDate?: string // For recurring income
}

export type ExpenseCategory = {
  id: string
  name: string
  color: string
}

export type Expense = {
  id: string
  name: string
  amount: number
  categoryId: string
  frequency: "monthly" | "weekly" | "biweekly" | "yearly" | "one-time"
  date?: string // For one-time expenses
  startDate?: string // For recurring expenses
}

export type MonthlyData = {
  month: string // Format: YYYY-MM
  projectedIncome: number
  actualIncome: number
  projectedExpenses: number
  actualExpenses: number
  projectedSavings: number
  actualSavings: number
}

export type Currency = {
  code: string
  symbol: string
  name: string
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
]

type FinanceState = {
  incomeSources: IncomeSource[]
  expenseCategories: ExpenseCategory[]
  expenses: Expense[]
  monthlyData: MonthlyData[]
  currency: Currency
  setCurrency: (currency: Currency) => void
  addIncomeSource: (source: Omit<IncomeSource, "id">) => void
  updateIncomeSource: (id: string, source: Partial<IncomeSource>) => void
  deleteIncomeSource: (id: string) => void
  addExpenseCategory: (category: Omit<ExpenseCategory, "id">) => void
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void
  deleteExpenseCategory: (id: string) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  updateMonthlyData: (month: string) => void
  getCurrentMonth: () => string
  getMonthlyData: (month: string) => MonthlyData | undefined
  calculateProjectedSavings: (month: string) => number
  calculateActualSavings: (month: string) => number
}

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Helper function to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

// Default expense categories
const defaultCategories: ExpenseCategory[] = [
  { id: generateId(), name: "Housing", color: "#FF5733" },
  { id: generateId(), name: "Transportation", color: "#33FF57" },
  { id: generateId(), name: "Food", color: "#3357FF" },
  { id: generateId(), name: "Utilities", color: "#F3FF33" },
  { id: generateId(), name: "Entertainment", color: "#FF33F3" },
  { id: generateId(), name: "Healthcare", color: "#33FFF3" },
  { id: generateId(), name: "Personal", color: "#FF8C33" },
  { id: generateId(), name: "Debt", color: "#8C33FF" },
]

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      incomeSources: [],
      expenseCategories: defaultCategories,
      expenses: [],
      monthlyData: [],
      currency: currencies[0],

      setCurrency: (currency) => {
        set({ currency })
      },

      addIncomeSource: (source) => {
        const newSource = { ...source, id: generateId() }
        set((state) => ({
          incomeSources: [...state.incomeSources, newSource],
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      updateIncomeSource: (id, source) => {
        set((state) => ({
          incomeSources: state.incomeSources.map((item) => (item.id === id ? { ...item, ...source } : item)),
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      deleteIncomeSource: (id) => {
        set((state) => ({
          incomeSources: state.incomeSources.filter((item) => item.id !== id),
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      addExpenseCategory: (category) => {
        const newCategory = { ...category, id: generateId() }
        set((state) => ({
          expenseCategories: [...state.expenseCategories, newCategory],
        }))
      },

      updateExpenseCategory: (id, category) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.map((item) => (item.id === id ? { ...item, ...category } : item)),
        }))
      },

      deleteExpenseCategory: (id) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.filter((item) => item.id !== id),
        }))
      },

      addExpense: (expense) => {
        const newExpense = { ...expense, id: generateId() }
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      updateExpense: (id, expense) => {
        set((state) => ({
          expenses: state.expenses.map((item) => (item.id === id ? { ...item, ...expense } : item)),
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((item) => item.id !== id),
        }))
        get().updateMonthlyData(getCurrentMonth())
      },

      updateMonthlyData: (month) => {
        const { incomeSources, expenses } = get()

        // Calculate projected income for the month
        const projectedIncome = incomeSources.reduce((total, source) => {
          // Skip one-time income from different months
          if (source.frequency === "one-time") {
            if (source.date && source.date.startsWith(month)) {
              return total + source.amount
            }
            return total
          }

          // Skip recurring income that hasn't started yet
          if (source.startDate && source.startDate > month) {
            return total
          }

          if (source.frequency === "monthly") {
            return total + source.amount
          }
          if (source.frequency === "yearly") {
            return total + source.amount / 12
          }
          if (source.frequency === "weekly") {
            return total + source.amount * 4.33 // Average weeks in a month
          }
          if (source.frequency === "biweekly") {
            return total + source.amount * 2.17 // Average bi-weeks in a month
          }
          return total
        }, 0)

        // Calculate projected expenses for the month
        const projectedExpenses = expenses.reduce((total, expense) => {
          // Skip one-time expenses from different months
          if (expense.frequency === "one-time") {
            if (expense.date && expense.date.startsWith(month)) {
              return total + expense.amount
            }
            return total
          }

          // Skip recurring expenses that haven't started yet
          if (expense.startDate && expense.startDate > month) {
            return total
          }

          if (expense.frequency === "monthly") {
            return total + expense.amount
          }
          if (expense.frequency === "yearly") {
            return total + expense.amount / 12
          }
          if (expense.frequency === "weekly") {
            return total + expense.amount * 4.33 // Average weeks in a month
          }
          if (expense.frequency === "biweekly") {
            return total + expense.amount * 2.17 // Average bi-weeks in a month
          }
          return total
        }, 0)

        // Calculate projected savings
        const projectedSavings = projectedIncome - projectedExpenses

        // For this demo, we'll set actual values equal to projected
        // In a real app, you would track actual transactions
        const actualIncome = projectedIncome
        const actualExpenses = projectedExpenses
        const actualSavings = projectedSavings

        // Update or create monthly data
        set((state) => {
          const existingDataIndex = state.monthlyData.findIndex((data) => data.month === month)

          if (existingDataIndex >= 0) {
            const updatedMonthlyData = [...state.monthlyData]
            updatedMonthlyData[existingDataIndex] = {
              ...updatedMonthlyData[existingDataIndex],
              projectedIncome,
              actualIncome,
              projectedExpenses,
              actualExpenses,
              projectedSavings,
              actualSavings,
            }
            return { monthlyData: updatedMonthlyData }
          } else {
            return {
              monthlyData: [
                ...state.monthlyData,
                {
                  month,
                  projectedIncome,
                  actualIncome,
                  projectedExpenses,
                  actualExpenses,
                  projectedSavings,
                  actualSavings,
                },
              ],
            }
          }
        })
      },

      getCurrentMonth,

      getMonthlyData: (month) => {
        return get().monthlyData.find((data) => data.month === month)
      },

      calculateProjectedSavings: (month) => {
        const data = get().getMonthlyData(month)
        return data ? data.projectedSavings : 0
      },

      calculateActualSavings: (month) => {
        const data = get().getMonthlyData(month)
        return data ? data.actualSavings : 0
      },
    }),
    {
      name: "finance-storage",
    },
  ),
)

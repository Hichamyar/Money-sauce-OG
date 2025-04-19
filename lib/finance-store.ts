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
  budget?: number
  periodicity: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
}

export type Expense = {
  id: string
  name: string
  amount: number
  categoryId: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly" | "one-time"
  date?: string // For one-time expenses
  startDate?: string // For recurring expenses
  month?: string // For specific month expenses
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

export type AppSettings = {
  userName: string
  emoji: string
  dataLocation: "local" | "google"
  currency: Currency
  theme: "light" | "dark" | "system"
  firstTimeSetupCompleted: boolean
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
  settings: AppSettings

  // Settings functions
  updateSettings: (settings: Partial<AppSettings>) => void
  getAppTitle: () => string

  // Income functions
  addIncomeSource: (source: Omit<IncomeSource, "id">) => void
  updateIncomeSource: (id: string, source: Partial<IncomeSource>) => void
  deleteIncomeSource: (id: string) => void

  // Category functions
  addExpenseCategory: (category: Omit<ExpenseCategory, "id">) => void
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void
  deleteExpenseCategory: (id: string) => void

  // Expense functions
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void

  // Data functions
  updateMonthlyData: (month: string) => void
  getCurrentMonth: () => string
  getMonthlyData: (month: string) => MonthlyData | undefined
  calculateProjectedSavings: (month: string) => number
  calculateActualSavings: (month: string) => number

  // Budget functions
  setCategoryBudget: (categoryId: string, budget: number) => void
  getCategoryExpenses: (categoryId: string, month?: string) => number
  getCategoryRemaining: (categoryId: string, month?: string) => number
  getTotalBudget: (month?: string) => number
  getTotalSpent: (month?: string) => number
  getBudgetPercentage: (month?: string) => number
  getMonthProgress: () => number
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
  { id: generateId(), name: "Housing", color: "#FF5733", budget: 1000, periodicity: "monthly" },
  { id: generateId(), name: "Transportation", color: "#33FF57", budget: 300, periodicity: "monthly" },
  { id: generateId(), name: "Food", color: "#3357FF", budget: 500, periodicity: "monthly" },
  { id: generateId(), name: "Utilities", color: "#F3FF33", budget: 200, periodicity: "monthly" },
  { id: generateId(), name: "Entertainment", color: "#FF33F3", budget: 150, periodicity: "monthly" },
  { id: generateId(), name: "Healthcare", color: "#33FFF3", budget: 200, periodicity: "monthly" },
  { id: generateId(), name: "Personal", color: "#FF8C33", budget: 100, periodicity: "monthly" },
  { id: generateId(), name: "Debt", color: "#8C33FF", budget: 300, periodicity: "monthly" },
]

// Default settings
const defaultSettings: AppSettings = {
  userName: "",
  emoji: "💰",
  dataLocation: "local",
  currency: currencies[0],
  theme: "system",
  firstTimeSetupCompleted: false,
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      incomeSources: [],
      expenseCategories: defaultCategories,
      expenses: [],
      monthlyData: [],
      settings: defaultSettings,

      // Settings functions
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }))
      },

      getAppTitle: () => {
        const { settings } = get()
        if (settings.userName) {
          return `Hicham helps ${settings.userName.toUpperCase()} with the money sauce`
        }
        return "Hicham's money sauce"
      },

      // Income functions
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

      // Category functions
      addExpenseCategory: (category) => {
        const newCategory = {
          ...category,
          id: generateId(),
          budget: category.budget || 0,
        }
        set((state) => ({
          expenseCategories: [...state.expenseCategories, newCategory],
        }))
      },

      updateExpenseCategory: (id, category) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...category,
                  // Ensure budget is a number
                  budget: category.budget !== undefined ? Number(category.budget) : item.budget,
                }
              : item,
          ),
        }))
      },

      deleteExpenseCategory: (id) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.filter((item) => item.id !== id),
        }))
      },

      // Expense functions
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

      // Data functions
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
          if (expense.frequency === "daily") {
            return total + expense.amount * 30 // Approximate days in a month
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

      // Budget functions
      setCategoryBudget: (categoryId, budget) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.map((category) =>
            category.id === categoryId ? { ...category, budget } : category,
          ),
        }))
      },

      getCategoryExpenses: (categoryId, month = getCurrentMonth()) => {
        const { expenses } = get()

        return expenses
          .filter((expense) => {
            // Only include expenses for the current category
            if (expense.categoryId !== categoryId) return false

            // For one-time expenses, check if they occur in this month
            if (expense.frequency === "one-time") {
              return expense.date && expense.date.startsWith(month)
            }

            // For month-specific expenses
            if (expense.month) {
              return expense.month === month
            }

            // For recurring expenses, check if they've started by this month
            if (expense.startDate) {
              return expense.startDate <= month
            }

            // For expenses without a startDate, assume they're active
            return true
          })
          .reduce((total, expense) => {
            // Calculate monthly equivalent
            if (expense.frequency === "monthly") return total + expense.amount
            if (expense.frequency === "weekly") return total + expense.amount * 4.33
            if (expense.frequency === "biweekly") return total + expense.amount * 2.17
            if (expense.frequency === "yearly") return total + expense.amount / 12
            if (expense.frequency === "daily") return total + expense.amount * 30
            if (expense.frequency === "one-time") return total + expense.amount
            return total
          }, 0)
      },

      getCategoryRemaining: (categoryId, month = getCurrentMonth()) => {
        const { expenseCategories } = get()
        const category = expenseCategories.find((cat) => cat.id === categoryId)
        const budget = category?.budget || 0
        const expenses = get().getCategoryExpenses(categoryId, month)

        return budget - expenses
      },

      getTotalBudget: (month = getCurrentMonth()) => {
        const { expenseCategories } = get()
        return expenseCategories.reduce((total, category) => total + (category.budget || 0), 0)
      },

      getTotalSpent: (month = getCurrentMonth()) => {
        const { expenseCategories } = get()
        return expenseCategories.reduce((total, category) => total + get().getCategoryExpenses(category.id, month), 0)
      },

      getBudgetPercentage: (month = getCurrentMonth()) => {
        const totalBudget = get().getTotalBudget(month)
        const totalSpent = get().getTotalSpent(month)

        if (totalBudget <= 0) return 0
        return Math.min((totalSpent / totalBudget) * 100, 100)
      },

      getMonthProgress: () => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const startOfMonth = new Date(currentYear, currentMonth, 1)
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0)

        const totalDays = endOfMonth.getDate()
        const elapsedDays = now.getDate() - 1

        return Math.min((elapsedDays / totalDays) * 100, 100)
      },
    }),
    {
      name: "finance-storage",
    },
  ),
)

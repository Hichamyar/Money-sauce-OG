"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinanceStore } from "@/lib/finance-store"
import { useCurrencyFormatter } from "@/lib/format-currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Check, Home, Receipt, Calendar } from "lucide-react"

export default function SetupGuidePage() {
  const router = useRouter()
  const { addIncomeSource, addExpense, expenseCategories, getCurrentMonth } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()

  const [activeTab, setActiveTab] = useState("revenue")
  const [income, setIncome] = useState({
    name: "Primary Income",
    amount: 0,
    frequency: "monthly",
  })

  const [recurringExpense, setRecurringExpense] = useState({
    name: "",
    amount: 0,
    categoryId: "",
    frequency: "monthly",
  })

  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([])

  const [specialExpense, setSpecialExpense] = useState({
    name: "",
    amount: 0,
    categoryId: "",
    date: "",
  })

  const [specialExpenses, setSpecialExpenses] = useState<any[]>([])

  const handleAddIncome = () => {
    if (income.name && income.amount > 0) {
      addIncomeSource(income)
      setActiveTab("recurring")
    }
  }

  const handleAddRecurringExpense = () => {
    if (recurringExpense.name && recurringExpense.amount > 0 && recurringExpense.categoryId) {
      setRecurringExpenses([...recurringExpenses, { ...recurringExpense, id: Date.now() }])
      setRecurringExpense({
        name: "",
        amount: 0,
        categoryId: "",
        frequency: "monthly",
      })
    }
  }

  const handleAddSpecialExpense = () => {
    if (specialExpense.name && specialExpense.amount > 0 && specialExpense.categoryId && specialExpense.date) {
      setSpecialExpenses([...specialExpenses, { ...specialExpense, id: Date.now() }])
      setSpecialExpense({
        name: "",
        amount: 0,
        categoryId: "",
        date: "",
      })
    }
  }

  const handleSaveAll = () => {
    // Save recurring expenses
    recurringExpenses.forEach((expense) => {
      addExpense({
        name: expense.name,
        amount: expense.amount,
        categoryId: expense.categoryId,
        frequency: expense.frequency,
      })
    })

    // Save special expenses
    specialExpenses.forEach((expense) => {
      addExpense({
        name: expense.name,
        amount: expense.amount,
        categoryId: expense.categoryId,
        frequency: "one-time",
        date: expense.date,
      })
    })

    // Redirect to dashboard
    router.push("/")
  }

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-weekly"
      case "monthly":
        return "Monthly"
      case "yearly":
        return "Yearly"
      default:
        return frequency
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = expenseCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Setup Guide</CardTitle>
          <CardDescription>Let's set up your finances step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="recurring" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span>Recurring Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Special Expenses</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 1: Add Your Income</h3>
                <p className="text-muted-foreground">Let's start by adding your primary source of income.</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="income-name">Income Source</Label>
                  <Input
                    id="income-name"
                    value={income.name}
                    onChange={(e) => setIncome({ ...income, name: e.target.value })}
                    placeholder="e.g., Salary, Freelance Work"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="income-amount">Amount</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    value={income.amount || ""}
                    onChange={(e) => setIncome({ ...income, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="income-frequency">Frequency</Label>
                  <Select
                    value={income.frequency}
                    onValueChange={(value) => setIncome({ ...income, frequency: value as any })}
                  >
                    <SelectTrigger id="income-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleAddIncome}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recurring" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 2: Add Recurring Expenses</h3>
                <p className="text-muted-foreground">
                  Now, let's add your regular monthly expenses like rent, utilities, and subscriptions.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="expense-name">Expense Name</Label>
                  <Input
                    id="expense-name"
                    value={recurringExpense.name}
                    onChange={(e) => setRecurringExpense({ ...recurringExpense, name: e.target.value })}
                    placeholder="e.g., Rent, Netflix"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    value={recurringExpense.amount || ""}
                    onChange={(e) => setRecurringExpense({ ...recurringExpense, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select
                    value={recurringExpense.categoryId}
                    onValueChange={(value) => setRecurringExpense({ ...recurringExpense, categoryId: value })}
                  >
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expense-frequency">Frequency</Label>
                  <Select
                    value={recurringExpense.frequency}
                    onValueChange={(value) => setRecurringExpense({ ...recurringExpense, frequency: value as any })}
                  >
                    <SelectTrigger id="expense-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddRecurringExpense}>Add Expense</Button>
              </div>

              {recurringExpenses.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Added Expenses:</h4>
                  <div className="space-y-2">
                    {recurringExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <span className="font-medium">{expense.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({formatFrequency(expense.frequency)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{currencyFormatter.format(expense.amount)}</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getCategoryName(expense.categoryId)
                                ? expenseCategories.find((cat) => cat.id === expense.categoryId)?.color
                                : "#CCCCCC",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("revenue")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setActiveTab("special")}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="special" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 3: Add Special Expenses</h3>
                <p className="text-muted-foreground">
                  Finally, add any one-time or special expenses you're planning for the future.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="special-name">Expense Name</Label>
                  <Input
                    id="special-name"
                    value={specialExpense.name}
                    onChange={(e) => setSpecialExpense({ ...specialExpense, name: e.target.value })}
                    placeholder="e.g., Vacation, Gift"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="special-amount">Amount</Label>
                  <Input
                    id="special-amount"
                    type="number"
                    value={specialExpense.amount || ""}
                    onChange={(e) => setSpecialExpense({ ...specialExpense, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="special-category">Category</Label>
                  <Select
                    value={specialExpense.categoryId}
                    onValueChange={(value) => setSpecialExpense({ ...specialExpense, categoryId: value })}
                  >
                    <SelectTrigger id="special-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="special-date">Date</Label>
                  <Input
                    id="special-date"
                    type="date"
                    value={specialExpense.date}
                    onChange={(e) => setSpecialExpense({ ...specialExpense, date: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddSpecialExpense}>Add Special Expense</Button>
              </div>

              {specialExpenses.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Added Special Expenses:</h4>
                  <div className="space-y-2">
                    {specialExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <span className="font-medium">{expense.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({new Date(expense.date).toLocaleDateString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{currencyFormatter.format(expense.amount)}</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getCategoryName(expense.categoryId)
                                ? expenseCategories.find((cat) => cat.id === expense.categoryId)?.color
                                : "#CCCCCC",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("recurring")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSaveAll}>
                  <Check className="mr-2 h-4 w-4" />
                  Save & Finish
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

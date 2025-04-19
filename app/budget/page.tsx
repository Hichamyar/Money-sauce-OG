"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinanceStore } from "@/lib/finance-store"
import { useCurrencyFormatter } from "@/lib/format-currency"
import { Progress } from "@/components/ui/progress"
import { Edit, Save, Plus, Calendar, PiggyBank } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BudgetPage() {
  const {
    expenseCategories,
    setCategoryBudget,
    getCategoryExpenses,
    getCategoryRemaining,
    getMonthProgress,
    getBudgetPercentage,
    updateExpenseCategory,
  } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()
  const [mounted, setMounted] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [budgetValue, setBudgetValue] = useState<number>(0)
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#FF5733",
    budget: 0,
    periodicity: "monthly",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const monthProgress = getMonthProgress()
  const budgetPercentage = getBudgetPercentage()

  const handleEditBudget = (categoryId: string, currentBudget = 0) => {
    setEditingCategory(categoryId)
    setBudgetValue(currentBudget)
  }

  const handleSaveBudget = (categoryId: string) => {
    setCategoryBudget(categoryId, budgetValue)
    setEditingCategory(null)
  }

  const handleAddCategory = () => {
    updateExpenseCategory(newCategory.name, {
      name: newCategory.name,
      color: newCategory.color,
      budget: newCategory.budget,
      periodicity: newCategory.periodicity as any,
    })
    setNewCategory({
      name: "",
      color: "#FF5733",
      budget: 0,
      periodicity: "monthly",
    })
    setIsAddDialogOpen(false)
  }

  const formatPeriodicity = (periodicity: string) => {
    switch (periodicity) {
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
        return periodicity
    }
  }

  // Get current month name
  const getCurrentMonthName = () => {
    const date = new Date()
    return date.toLocaleString("default", { month: "long" })
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budget Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
              <DialogDescription>Create a new budget category to track your expenses.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: newCategory.color }}></div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget Amount</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodicity">Periodicity</Label>
                <Select
                  value={newCategory.periodicity}
                  onValueChange={(value) => setNewCategory({ ...newCategory, periodicity: value })}
                >
                  <SelectTrigger id="periodicity">
                    <SelectValue placeholder="Select periodicity" />
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Bars */}
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{getCurrentMonthName()}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{monthProgress.toFixed(0)}% through month</span>
              </div>
              <Progress value={monthProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Global spending budget</h3>
                </div>
                <span className="text-sm text-muted-foreground">{budgetPercentage.toFixed(0)}% budget spent</span>
              </div>
              <Progress
                value={budgetPercentage}
                className="h-2"
                indicatorClassName={
                  budgetPercentage >= 100 ? "bg-red-500" : budgetPercentage >= 80 ? "bg-amber-500" : "bg-green-500"
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>Manage your budget categories and spending limits</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Periodicity</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseCategories.map((category) => {
                const budget = category.budget || 0
                const spent = getCategoryExpenses(category.id)
                const remaining = getCategoryRemaining(category.id)

                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div
                        className="w-4 h-full min-h-[24px] rounded"
                        style={{ backgroundColor: category.color }}
                      ></div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      {editingCategory === category.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={budgetValue}
                            onChange={(e) => setBudgetValue(Number(e.target.value))}
                            className="w-24"
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveBudget(category.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        currencyFormatter.format(budget)
                      )}
                    </TableCell>
                    <TableCell>{formatPeriodicity(category.periodicity)}</TableCell>
                    <TableCell>{currencyFormatter.format(spent)}</TableCell>
                    <TableCell
                      className={
                        remaining < 0 ? "text-red-500" : remaining < budget * 0.2 ? "text-amber-500" : "text-green-500"
                      }
                    >
                      {currencyFormatter.format(remaining)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditBudget(category.id, budget)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

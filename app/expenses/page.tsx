"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceStore, type Expense, type ExpenseCategory } from "@/lib/finance-store"
import { CalendarIcon, DollarSign, Edit, Plus, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrencyFormatter } from "@/lib/format-currency"

export default function ExpensesPage() {
  const {
    expenses,
    expenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    currency,
  } = useFinanceStore()

  const currencyFormatter = useCurrencyFormatter()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)

  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    name: "",
    amount: 0,
    categoryId: "",
    frequency: "monthly",
  })

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [editDate, setEditDate] = useState<Date | undefined>()

  const [newCategory, setNewCategory] = useState<Omit<ExpenseCategory, "id">>({
    name: "",
    color: "#FF5733",
  })

  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null)

  const handleAddExpense = () => {
    // Add date if one-time expense
    const expenseToAdd = { ...newExpense }
    if (newExpense.frequency === "one-time" && date) {
      expenseToAdd.date = format(date, "yyyy-MM-dd")
    } else if (newExpense.frequency !== "one-time" && date) {
      // Add startDate for recurring expenses if a specific month is selected
      expenseToAdd.startDate = format(date, "yyyy-MM")
    }

    addExpense(expenseToAdd)
    setNewExpense({
      name: "",
      amount: 0,
      categoryId: "",
      frequency: "monthly",
    })
    setDate(undefined)
    setIsAddDialogOpen(false)
  }

  const handleEditExpense = () => {
    if (!editingExpense) return

    const expenseToUpdate: Partial<Expense> = {
      name: editingExpense.name,
      amount: editingExpense.amount,
      categoryId: editingExpense.categoryId,
      frequency: editingExpense.frequency,
    }

    // Add date if one-time expense
    if (editingExpense.frequency === "one-time" && editDate) {
      expenseToUpdate.date = format(editDate, "yyyy-MM-dd")
    } else if (editingExpense.frequency !== "one-time" && editDate) {
      // Add startDate for recurring expenses if a specific month is selected
      expenseToUpdate.startDate = format(editDate, "yyyy-MM")
    }

    updateExpense(editingExpense.id, expenseToUpdate)
    setEditingExpense(null)
    setEditDate(undefined)
    setIsEditDialogOpen(false)
  }

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense)
    if (expense.date) {
      setEditDate(new Date(expense.date))
    } else if (expense.startDate) {
      setEditDate(new Date(expense.startDate))
    }
    setIsEditDialogOpen(true)
  }

  const handleAddCategory = () => {
    addExpenseCategory(newCategory)
    setNewCategory({
      name: "",
      color: "#FF5733",
    })
    setIsCategoryDialogOpen(false)
  }

  const handleEditCategory = () => {
    if (!editingCategory) return

    updateExpenseCategory(editingCategory.id, {
      name: editingCategory.name,
      color: editingCategory.color,
    })

    setEditingCategory(null)
    setIsEditCategoryDialogOpen(false)
  }

  const startEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category)
    setIsEditCategoryDialogOpen(true)
  }

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case "monthly":
        return "Monthly"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-weekly"
      case "yearly":
        return "Yearly"
      case "one-time":
        return "One-time"
      default:
        return frequency
    }
  }

  // Calculate monthly equivalent for different frequencies
  const calculateMonthlyAmount = (expense: Expense) => {
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
        return 0 // One-time expense doesn't have a monthly equivalent
      default:
        return expense.amount
    }
  }

  // Calculate total monthly expenses
  const totalMonthlyExpenses = expenses
    .filter((expense) => expense.frequency !== "one-time")
    .reduce((total, expense) => total + calculateMonthlyAmount(expense), 0)

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Expense Management</h2>
        <div className="flex space-x-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense Category</DialogTitle>
                <DialogDescription>Create a new category to organize your expenses.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Housing, Transportation"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="category-color"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    />
                    <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: newCategory.color }}></div>
                    <span className="text-sm">{newCategory.color}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>Add a new expense to track your spending.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Expense Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Rent, Groceries"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-8"
                      placeholder="0.00"
                      value={newExpense.amount || ""}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.categoryId}
                    onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newExpense.frequency}
                    onValueChange={(value) => setNewExpense({ ...newExpense, frequency: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newExpense.frequency === "one-time" && (
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {newExpense.frequency !== "one-time" && (
                  <div className="grid gap-2">
                    <Label htmlFor="specific-month">Specific Month (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="specific-month"
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMMM yyyy") : "Select a month"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setDate(1))} // Disable past months
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Leave empty for recurring expenses starting now, or select a future month to start this expense.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
          <CardDescription>Overview of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Monthly Expenses:</span>
              <span className="font-bold text-xl">{currencyFormatter.format(totalMonthlyExpenses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Number of Expenses:</span>
              <span>{expenses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Number of Categories:</span>
              <span>{expenseCategories.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>Manage your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No expenses added yet</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Expense
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Monthly Equivalent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                            ></div>
                            {getCategoryName(expense.categoryId)}
                          </div>
                        </TableCell>
                        <TableCell>{currencyFormatter.format(expense.amount)}</TableCell>
                        <TableCell>
                          {formatFrequency(expense.frequency)}
                          {expense.frequency === "one-time" && expense.date && (
                            <span className="block text-xs text-muted-foreground">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                            </span>
                          )}
                          {expense.frequency !== "one-time" && expense.startDate && (
                            <span className="block text-xs text-muted-foreground">
                              Starts: {format(new Date(expense.startDate + "-01"), "MMM yyyy")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {expense.frequency !== "one-time" ? (
                            `${currencyFormatter.format(calculateMonthlyAmount(expense))}`
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(expense)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Manage your expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Number of Expenses</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((category) => {
                    const categoryExpenses = expenses.filter((e) => e.categoryId === category.id)
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell>{category.color}</TableCell>
                        <TableCell>{categoryExpenses.length}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => startEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpenseCategory(category.id)}
                            disabled={categoryExpenses.length > 0}
                            title={
                              categoryExpenses.length > 0 ? "Cannot delete category with expenses" : "Delete category"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update your expense details.</DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Expense Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Rent, Groceries"
                  value={editingExpense.name}
                  onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-amount"
                    type="number"
                    className="pl-8"
                    placeholder="0.00"
                    value={editingExpense.amount || ""}
                    onChange={(e) =>
                      setEditingExpense({ ...editingExpense, amount: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingExpense.categoryId}
                  onValueChange={(value) => setEditingExpense({ ...editingExpense, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={editingExpense.frequency}
                  onValueChange={(value) => setEditingExpense({ ...editingExpense, frequency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingExpense?.frequency === "one-time" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? format(editDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={editDate} onSelect={setEditDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {editingExpense?.frequency !== "one-time" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-specific-month">Specific Month (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-specific-month"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? format(editDate, "MMMM yyyy") : "Select a month"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setDate(1))} // Disable past months
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    Leave empty for recurring expenses starting now, or select a future month to start this expense.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExpense}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update your expense category.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  placeholder="e.g., Housing, Transportation"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category-color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-category-color"
                    type="color"
                    className="w-12 h-8 p-1"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  />
                  <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: editingCategory.color }}></div>
                  <span className="text-sm">{editingCategory.color}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

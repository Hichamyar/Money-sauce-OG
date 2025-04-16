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
import { useFinanceStore, type IncomeSource } from "@/lib/finance-store"
import { CalendarIcon, DollarSign, Edit, Plus, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCurrencyFormatter } from "@/lib/format-currency"

export default function IncomePage() {
  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource, currency } = useFinanceStore()
  const currencyFormatter = useCurrencyFormatter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newIncome, setNewIncome] = useState<Omit<IncomeSource, "id">>({
    name: "",
    amount: 0,
    frequency: "monthly",
  })
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [editDate, setEditDate] = useState<Date | undefined>()

  const handleAddIncome = () => {
    // Add date if one-time income
    const incomeToAdd = { ...newIncome }
    if (newIncome.frequency === "one-time" && date) {
      incomeToAdd.date = format(date, "yyyy-MM-dd")
    }

    addIncomeSource(incomeToAdd)
    setNewIncome({
      name: "",
      amount: 0,
      frequency: "monthly",
    })
    setDate(undefined)
    setIsAddDialogOpen(false)
  }

  const handleEditIncome = () => {
    if (!editingIncome) return

    const incomeToUpdate: Partial<IncomeSource> = {
      name: editingIncome.name,
      amount: editingIncome.amount,
      frequency: editingIncome.frequency,
    }

    // Add date if one-time income
    if (editingIncome.frequency === "one-time" && editDate) {
      incomeToUpdate.date = format(editDate, "yyyy-MM-dd")
    }

    updateIncomeSource(editingIncome.id, incomeToUpdate)
    setEditingIncome(null)
    setEditDate(undefined)
    setIsEditDialogOpen(false)
  }

  const startEdit = (income: IncomeSource) => {
    setEditingIncome(income)
    if (income.date) {
      setEditDate(new Date(income.date))
    }
    setIsEditDialogOpen(true)
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
  const calculateMonthlyAmount = (income: IncomeSource) => {
    switch (income.frequency) {
      case "monthly":
        return income.amount
      case "weekly":
        return income.amount * 4.33
      case "biweekly":
        return income.amount * 2.17
      case "yearly":
        return income.amount / 12
      case "one-time":
        return 0 // One-time income doesn't have a monthly equivalent
      default:
        return income.amount
    }
  }

  // Calculate total monthly income
  const totalMonthlyIncome = incomeSources
    .filter((income) => income.frequency !== "one-time")
    .reduce((total, income) => total + calculateMonthlyAmount(income), 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Income Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Income Source</DialogTitle>
              <DialogDescription>Add a new income source to track your earnings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Income Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Salary, Freelance Work"
                  value={newIncome.name}
                  onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
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
                    value={newIncome.amount || ""}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newIncome.frequency}
                  onValueChange={(value) => setNewIncome({ ...newIncome, frequency: value as any })}
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

              {newIncome.frequency === "one-time" && (
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddIncome}>Add Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>Overview of your income sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Monthly Income:</span>
              <span className="font-bold text-xl">{currencyFormatter.format(totalMonthlyIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Number of Income Sources:</span>
              <span>{incomeSources.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Sources</CardTitle>
          <CardDescription>Manage your income sources</CardDescription>
        </CardHeader>
        <CardContent>
          {incomeSources.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No income sources added yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Income
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Monthly Equivalent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeSources.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell className="font-medium">{income.name}</TableCell>
                    <TableCell>{currencyFormatter.format(income.amount)}</TableCell>
                    <TableCell>
                      {formatFrequency(income.frequency)}
                      {income.frequency === "one-time" && income.date && (
                        <span className="block text-xs text-muted-foreground">
                          {format(new Date(income.date), "MMM d, yyyy")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {income.frequency !== "one-time" ? (
                        `${currencyFormatter.format(calculateMonthlyAmount(income))}`
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(income)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteIncomeSource(income.id)}>
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

      {/* Edit Income Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income Source</DialogTitle>
            <DialogDescription>Update your income source details.</DialogDescription>
          </DialogHeader>
          {editingIncome && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Income Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Salary, Freelance Work"
                  value={editingIncome.name}
                  onChange={(e) => setEditingIncome({ ...editingIncome, name: e.target.value })}
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
                    value={editingIncome.amount || ""}
                    onChange={(e) =>
                      setEditingIncome({ ...editingIncome, amount: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={editingIncome.frequency}
                  onValueChange={(value) => setEditingIncome({ ...editingIncome, frequency: value as any })}
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

              {editingIncome.frequency === "one-time" && (
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditIncome}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

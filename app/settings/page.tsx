"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinanceStore, currencies } from "@/lib/finance-store"
import { HardDrive, Cloud } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmojiPicker from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    expenseCategories,
    updateExpenseCategory,
    addExpenseCategory,
    deleteExpenseCategory,
    expenses,
  } = useFinanceStore()
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", color: "#FF5733", periodicity: "monthly" })
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    setUserName(settings.userName)
  }, [settings.userName])

  const handleNameChange = () => {
    if (userName.trim()) {
      updateSettings({ userName })
    }
  }

  const handleEmojiSelect = (emojiData: any) => {
    updateSettings({ emoji: emojiData.emoji })
    setShowEmojiPicker(false)
  }

  const handleDataLocationChange = (location: "local" | "google") => {
    if (location === "google") {
      toast({
        title: "Google Integration",
        description:
          "This is a demo feature. In a production app, this would connect to Google for authentication and data syncing.",
        duration: 5000,
      })
    }

    updateSettings({ dataLocation: location })
  }

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    updateSettings({ theme })
  }

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode)
    if (currency) {
      updateSettings({ currency })
    }
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addExpenseCategory({
        name: newCategory.name,
        color: newCategory.color,
        periodicity: newCategory.periodicity as any,
      })
      setNewCategory({ name: "", color: "#FF5733", periodicity: "monthly" })
    }
  }

  const handleUpdateCategory = () => {
    if (editingCategoryId && newCategory.name.trim()) {
      updateExpenseCategory(editingCategoryId, {
        name: newCategory.name,
        color: newCategory.color,
        periodicity: newCategory.periodicity as any,
      })
      setNewCategory({ name: "", color: "#FF5733", periodicity: "monthly" })
      setEditingCategoryId(null)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Settings</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Button onClick={handleNameChange}>Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will change the app title to "Hicham helps {userName.toUpperCase()} with the money sauce"
                </p>
              </div>

              <div className="space-y-2">
                <Label>App Emoji</Label>
                <div className="flex items-center space-x-2">
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="text-2xl h-10 px-3">
                        {settings.emoji}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </PopoverContent>
                  </Popover>
                  <span className="text-sm text-muted-foreground">Click to change the app emoji</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Storage</CardTitle>
              <CardDescription>Choose where to store your financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  variant={settings.dataLocation === "local" ? "default" : "outline"}
                  className="flex items-center justify-center gap-2 h-16"
                  onClick={() => handleDataLocationChange("local")}
                >
                  <HardDrive className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Use Locally</div>
                    <div className="text-xs text-muted-foreground">Stores data on this device only</div>
                  </div>
                </Button>
                <Button
                  variant={settings.dataLocation === "google" ? "default" : "outline"}
                  className="flex items-center justify-center gap-2 h-16"
                  onClick={() => handleDataLocationChange("google")}
                >
                  <Cloud className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Connect with Google</div>
                    <div className="text-xs text-muted-foreground">Backs up data to the cloud</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the app appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleThemeChange(value as any)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency.code} onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Manage your expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Groceries"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="category-color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-12 h-8 p-1"
                      />
                      <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: newCategory.color }}></div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category-periodicity">Periodicity</Label>
                    <Select
                      value={newCategory.periodicity}
                      onValueChange={(value) => setNewCategory({ ...newCategory, periodicity: value })}
                    >
                      <SelectTrigger id="category-periodicity">
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
                {editingCategoryId ? (
                  <Button onClick={handleUpdateCategory}>Update Category</Button>
                ) : (
                  <Button onClick={handleAddCategory}>Add Category</Button>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Existing Categories</h3>
                <div className="space-y-4">
                  {expenseCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">({category.periodicity})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewCategory({
                              name: category.name,
                              color: category.color,
                              periodicity: category.periodicity,
                            })
                            setEditingCategoryId(category.id)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Check if any expenses use this category
                            const hasExpenses = expenses.some((expense) => expense.categoryId === category.id)
                            if (hasExpenses) {
                              toast({
                                title: "Cannot Delete Category",
                                description:
                                  "This category is being used by one or more expenses. Remove those expenses first.",
                                variant: "destructive",
                              })
                            } else {
                              deleteExpenseCategory(category.id)
                              toast({
                                title: "Category Deleted",
                                description: "The category has been successfully deleted.",
                              })
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

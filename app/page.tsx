"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/finance-store"
import { BookOpen, PiggyBank, Receipt } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { updateMonthlyData, getCurrentMonth } = useFinanceStore()

  const currentMonth = getCurrentMonth()

  useEffect(() => {
    setMounted(true)
    // Update monthly data when component mounts
    updateMonthlyData(currentMonth)
  }, [updateMonthlyData, currentMonth])

  if (!mounted) return null

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Top Zone - Guide to Set Up */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">New to budgeting?</h2>
              <p className="text-muted-foreground">
                Follow our step-by-step guide to set up your finances efficiently.
              </p>
            </div>
            <Link href="/setup-guide">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Guide to Set Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Two Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Determine Budgets */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Determine Budgets</CardTitle>
            <CardDescription>Set up your budget categories and allocate funds.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <PiggyBank className="h-16 w-16 text-primary" />
            <p className="text-center text-muted-foreground">
              Create budget categories and set spending limits to keep your finances on track.
            </p>
            <Link href="/budget">
              <Button className="w-full">Manage Budgets</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Add Expenses */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Add Expenses</CardTitle>
            <CardDescription>Track your spending by recording expenses.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Receipt className="h-16 w-16 text-primary" />
            <p className="text-center text-muted-foreground">
              Record your expenses to monitor your spending habits and stay within budget.
            </p>
            <Link href="/expenses">
              <Button className="w-full">Add Expenses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

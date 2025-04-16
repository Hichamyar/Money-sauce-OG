"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, differenceInDays } from "date-fns"
import { useFinanceStore } from "@/lib/finance-store"
import { Progress } from "@/components/ui/progress"

export function MonthCycleIndicator() {
  const { getCurrentMonth } = useFinanceStore()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  // Parse the YYYY-MM format to a Date object
  const parseMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
  }

  // Format a Date to YYYY-MM format
  const formatYearMonth = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  }

  const currentDate = new Date()
  const selectedDate = parseMonth(selectedMonth)
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)

  // Calculate progress through current month (as percentage)
  const calculateMonthProgress = () => {
    // Only calculate progress for the current month
    if (
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    ) {
      const totalDays = differenceInDays(monthEnd, monthStart) + 1
      const daysPassed = differenceInDays(currentDate, monthStart) + 1
      return Math.min(Math.round((daysPassed / totalDays) * 100), 100)
    }

    // For past months, show 100%
    if (
      currentDate.getFullYear() > selectedDate.getFullYear() ||
      (currentDate.getFullYear() === selectedDate.getFullYear() && currentDate.getMonth() > selectedDate.getMonth())
    ) {
      return 100
    }

    // For future months, show 0%
    return 0
  }

  const monthProgress = calculateMonthProgress()

  const goToPreviousMonth = () => {
    const prevMonth = subMonths(selectedDate, 1)
    setSelectedMonth(formatYearMonth(prevMonth))
  }

  const goToNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1)
    setSelectedMonth(formatYearMonth(nextMonth))
  }

  const goToCurrentMonth = () => {
    setSelectedMonth(getCurrentMonth())
  }

  // Determine if we're in the current month
  const isCurrentMonth =
    currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="font-medium text-lg">{format(selectedDate, "MMMM yyyy")}</span>
            {!isCurrentMonth && (
              <Button variant="ghost" size="sm" onClick={goToCurrentMonth}>
                <Calendar className="h-4 w-4 mr-1" />
                Current
              </Button>
            )}
          </div>

          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{format(monthStart, "MMM d")}</span>
            <span>{format(monthEnd, "MMM d")}</span>
          </div>
          <Progress value={monthProgress} className="h-2" />
          <div className="flex justify-between text-xs">
            <span>Cycle Start</span>
            <span className="font-medium">
              {isCurrentMonth
                ? `${monthProgress}% through month`
                : monthProgress === 100
                  ? "Month Complete"
                  : "Upcoming Month"}
            </span>
            <span>Cycle End</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

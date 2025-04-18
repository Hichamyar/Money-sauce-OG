"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useFinanceStore } from "@/lib/finance-store"
import { useTheme } from "next-themes"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { updateMonthlyData, getCurrentMonth } = useFinanceStore()
  const { theme } = useTheme()

  const currentMonth = getCurrentMonth()

  useEffect(() => {
    setMounted(true)
    // Update monthly data when component mounts
    updateMonthlyData(currentMonth)
  }, [updateMonthlyData, currentMonth])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your Finances
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Track your income, manage expenses, and watch your savings grow with Hicham's money sauce.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button className="px-8">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dancing Text Section */}
      <section className="w-full py-12 md:py-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 1],
            opacity: 1,
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-semibold">This is created by Hicham, allah isehel elih yarebbi</p>
        </motion.div>
      </section>
    </div>
  )
}

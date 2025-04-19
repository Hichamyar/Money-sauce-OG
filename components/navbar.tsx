"use client"

import Link from "next/link"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Menu, X, DollarSign } from "lucide-react"
import { CurrencySelector } from "./currency-selector"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6" />
          <span className="font-bold text-xl">Hicham's money sauce</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="/income" className="text-sm font-medium transition-colors hover:text-primary">
            Income
          </Link>
          <Link href="/expenses" className="text-sm font-medium transition-colors hover:text-primary">
            Expenses
          </Link>
          <Link href="/projections" className="text-sm font-medium transition-colors hover:text-primary">
            Projections
          </Link>
          <Link href="/details" className="text-sm font-medium transition-colors hover:text-primary">
            Details
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <CurrencySelector />
          <ModeToggle />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <nav className="flex flex-col space-y-3 p-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/income"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Income
            </Link>
            <Link
              href="/expenses"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Expenses
            </Link>
            <Link
              href="/projections"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Projections
            </Link>
            <Link
              href="/details"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Details
            </Link>
            <div className="flex items-center gap-2 pt-2">
              <CurrencySelector />
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

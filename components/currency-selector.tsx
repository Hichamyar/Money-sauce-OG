"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFinanceStore, currencies } from "@/lib/finance-store"

export function CurrencySelector() {
  const { currency, setCurrency } = useFinanceStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currency.symbol} {currency.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currency.code}
          onValueChange={(value) => {
            const selectedCurrency = currencies.find((c) => c.code === value)
            if (selectedCurrency) {
              setCurrency(selectedCurrency)
            }
          }}
        >
          {currencies.map((curr) => (
            <DropdownMenuRadioItem key={curr.code} value={curr.code}>
              <span className="mr-2">{curr.symbol}</span>
              {curr.name} ({curr.code})
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

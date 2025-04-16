import { useFinanceStore } from "./finance-store"

export function useCurrencyFormatter() {
  const { currency } = useFinanceStore()

  return {
    format: (amount: number) => {
      return `${currency.symbol}${amount.toFixed(2)}`
    },
  }
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"
import { useFinanceStore } from "@/lib/finance-store"
import { User, LogOut, UserPlus } from "lucide-react"

export function ProfileSwitcher() {
  const router = useRouter()
  const { users, currentUser, logout } = useAuthStore()
  const { setUserId } = useFinanceStore()

  const currentUsername = users.find((user) => user.id === currentUser)?.username || "Guest"

  useEffect(() => {
    // Redirect to login if not logged in
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  const handleLogout = () => {
    logout()
    setUserId(null)
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{currentUsername}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/signup")}>
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Add New Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

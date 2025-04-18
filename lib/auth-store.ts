"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: string
  username: string
  password?: string
}

type AuthState = {
  users: User[]
  currentUser: string | null
  addUser: (username: string, password: string) => boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      addUser: (username, password) => {
        const existingUser = get().users.find((user) => user.username === username)
        if (existingUser) {
          return false
        }
        const newUser: User = { id: generateId(), username, password }
        set((state) => ({ users: [...state.users, newUser] }))
        return true
      },
      login: (username, password) => {
        const user = get().users.find((user) => user.username === username && user.password === password)
        if (user) {
          set({ currentUser: user.id })
          return true
        }
        return false
      },
      logout: () => {
        set({ currentUser: null })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

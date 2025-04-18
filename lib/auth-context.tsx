"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  username: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Set basic user info even without profile
          const basicUser = {
            id: session.user.id,
            email: session.user.email || "",
            username: session.user.user_metadata?.username || "",
          }

          try {
            // Try to get user profile, but don't fail if table doesn't exist
            const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

            if (data) {
              setUser({
                ...basicUser,
                username: data.username || basicUser.username,
              })
            } else {
              setUser(basicUser)
            }
          } catch (profileError) {
            console.warn("Profile fetch error (table might not exist yet):", profileError)
            setUser(basicUser)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Auth error:", err)
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          // Set basic user info even without profile
          const basicUser = {
            id: session.user.id,
            email: session.user.email || "",
            username: session.user.user_metadata?.username || "",
          }

          try {
            // Try to get user profile, but don't fail if table doesn't exist
            const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

            if (data) {
              setUser({
                ...basicUser,
                username: data.username || basicUser.username,
              })
            } else {
              setUser(basicUser)
            }
          } catch (profileError) {
            console.warn("Profile fetch error on auth change (table might not exist yet):", profileError)
            setUser(basicUser)
          }
        } else {
          setUser(null)
        }

        setLoading(false)
        router.refresh()
      } catch (err) {
        console.error("Auth change error:", err)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Sign up directly with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      if (!data.user) {
        return { error: "Failed to create user" }
      }

      try {
        // Try to create profile, but don't fail if table doesn't exist
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username,
            email,
          },
        ])
      } catch (profileError) {
        console.warn("Profile creation error (table might not exist yet):", profileError)
        // Continue even if profile creation fails
      }

      return {}
    } catch (error) {
      console.error("Signup error:", error)
      return { error: error instanceof Error ? error.message : "An unexpected error occurred during signup" }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Sign in directly with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error("Login error:", error)
      return { error: error instanceof Error ? error.message : "An unexpected error occurred during login" }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

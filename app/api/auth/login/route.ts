import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login API error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      // Don't fail the login if profile fetch fails
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      profile: profile || null,
    })
  } catch (error) {
    console.error("Login route error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

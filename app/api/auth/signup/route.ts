import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, username } = signupSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if username already exists
    const { data: existingUsers, error: usernameCheckError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .limit(1)

    if (usernameCheckError) {
      console.error("Username check error:", usernameCheckError)
      return NextResponse.json({ error: "Error checking username availability" }, { status: 500 })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create the user with auto-confirm enabled
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        // This ensures the user is automatically confirmed
        emailRedirectTo: `${request.headers.get("origin")}/login`,
      },
    })

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create profile entry
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        username,
        email,
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      return NextResponse.json({ error: "User created but profile setup failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Signup route error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

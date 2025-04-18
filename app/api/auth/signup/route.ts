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
    const { data: existingUsers } = await supabase.from("profiles").select("*").eq("username", username).limit(1)

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create the user
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
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create profile entry
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          username,
          email,
        },
      ])

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

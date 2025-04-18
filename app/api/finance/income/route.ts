import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const incomeSchema = z.object({
  name: z.string(),
  amount: z.number(),
  frequency: z.enum(["monthly", "weekly", "biweekly", "yearly", "one-time"]),
  date: z.string().optional(),
  startDate: z.string().optional(),
})

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all income sources for the user
  const { data, error } = await supabase.from("income_sources").select("*").eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const income = incomeSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert the income source
    const { data, error } = await supabase
      .from("income_sources")
      .insert([
        {
          ...income,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

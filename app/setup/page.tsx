"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const setupDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create profiles table
      const { error: createTableError } = await supabase.rpc("create_profiles_table")

      if (createTableError) {
        throw new Error(`Failed to create profiles table: ${createTableError.message}`)
      }

      setSuccess(true)
    } catch (err) {
      console.error("Setup error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred during setup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 mx-auto">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Set up the necessary database tables for the application</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="mb-4">
              <AlertDescription>Database setup completed successfully!</AlertDescription>
            </Alert>
          ) : (
            <p className="mb-4">
              Click the button below to set up the required database tables. This only needs to be done once.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {success ? (
            <Link href="/login" className="w-full">
              <Button className="w-full">Go to Login</Button>
            </Link>
          ) : (
            <Button onClick={setupDatabase} disabled={loading} className="w-full">
              {loading ? "Setting up..." : "Set Up Database"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

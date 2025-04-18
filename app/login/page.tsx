import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"

// Get search params server-side
export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const message = searchParams.message || ""

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm message={message} />
      </Suspense>
    </div>
  )
}

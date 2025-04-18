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
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm message={message} />
      </Suspense>
    </div>
  )
}

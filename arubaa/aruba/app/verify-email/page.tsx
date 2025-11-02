"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Verification token is missing")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setMessage(data.error || "Failed to verify email")
          return
        }

        setStatus("success")
        setMessage(data.message || "Email verified successfully!")

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("An error occurred during email verification")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md z-10">
        <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-2 shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6 px-6">
            <div className="flex justify-center mb-4">
              {status === "loading" && (
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {status === "error" && (
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {status === "loading" && "Verifying Email"}
              {status === "success" && "Email Verified"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-base">
              {status === "loading" && "Please wait while we verify your email address..."}
              {status === "success" && "Your email has been successfully verified!"}
              {status === "error" && "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p
                className={`text-sm ${
                  status === "success"
                    ? "text-green-700 dark:text-green-400"
                    : status === "error"
                    ? "text-red-700 dark:text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {message}
              </p>
            </div>

            {status === "success" && (
              <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  Redirecting to login page...
                </p>
                <Button
                  asChild
                  className="w-full h-12 text-base font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Button
                  asChild
                  className="w-full h-12 text-base font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  If you need help, please contact support or try signing up again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md z-10">
            <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-2 shadow-2xl">
              <CardHeader className="space-y-3 text-center pb-6 px-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Loading...
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}


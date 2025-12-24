"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
  mode: "login" | "signup"
}

export function AuthForm({ mode, className, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const router = useRouter()

  const isLogin = mode === "login"
  const title = isLogin ? "Welcome back" : "Create an account"
  const description = isLogin ? "Enter your email and password to sign in" : "Enter your details to create an account"
  const buttonText = isLogin ? "Sign In" : "Sign Up"
  const linkText = isLogin ? "Don't have an account?" : "Already have an account?"
  const linkLabel = isLogin ? "Sign up" : "Sign in"
  const linkHref = isLogin ? "/signup" : "/login"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/",
        })
        
        if (error) {
          setError(error.message || "Failed to sign in")
          setIsLoading(false)
          return
        }

        router.push("/")
      } else {
        const { error } = await authClient.signUp.email({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          callbackURL: "/",
        })

        if (error) {
          setError(error.message || "Failed to create account")
          setIsLoading(false)
          return
        }

        router.push("/")
      }
    } catch {
      setError(isLogin ? "Failed to sign in" : "Failed to create account")
      setIsLoading(false)
    }
  }

const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.social({
  provider: "google", // or any other provider id
})


        
        if (error) {
          setError(error.message || "Failed to sign in")
          setIsLoading(false)
          return
        }

        router.push("/")
      } else {
        const { error } = await authClient.signUp.email({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          callbackURL: "/",
        })

        if (error) {
          setError(error.message || "Failed to create account")
          setIsLoading(false)
          return
        }

        router.push("/")
      }
    } catch {
      setError(isLogin ? "Failed to sign in" : "Failed to create account")
      setIsLoading(false)
    }
  }
  


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please SignUp/In using VIT Google Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className="w-full"
            onClick={handleSubmit1}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              "Continue with Google"
            )}
          </Button>
        </CardContent>
      </Card>
      
    </div>
  )
}
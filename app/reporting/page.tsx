import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.svg"
import logoDark from "@/assets/logo-dark.svg"

import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-muted rounded-2xl p-4 md:p-6">
        <iframe
          src="https://docs.google.com/forms/d/1JFRwQbvtBCWWApFzGJ61WUAfO59zObxJRsnqEmvaHuk/viewform?usp=sf_link"
          className="w-full h-[60vh] md:h-[82vh] rounded-xl"
          allowFullScreen
        />
      </div>
    </div>
  )
}
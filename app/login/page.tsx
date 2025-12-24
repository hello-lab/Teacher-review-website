import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.svg"
import logoDark from "@/assets/logo-dark.svg"

import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-8 px-4 gap-4">
      <div className="w-full max-w-md sm:max-w-lg gap-4">
        
        <AuthForm mode="login" />
        <div className="flex gap-3">
        Powered Using <Link href="/" className="flex inline items-center gap-2 self-center font-medium">
          <Image
            className="h-6 w-auto dark:hidden"
            src={logo}
            alt="MongoDB logo"
            width={88}
            height={24}
            priority
          />
          <Image
            className="hidden h-6 w-auto dark:block"
            src={logoDark}
            alt="MongoDB logo"
            width={88}
            height={24}
            priority
          />
        </Link></div>
      </div>
    </div>
  )
}

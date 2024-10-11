"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"
import { siteConfig } from "@/config/site"

export default function LoginPage() {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSent = window.location.search.includes("sent")
      setSent(isSent)
    }
  }, [])

  return (
    <>
      {sent ? (
        <>
          <div className="flex flex-col gap-3 text-center">
            <Link href="/">
              <Icons.logo className="mx-auto mb-6 size-8" />
            </Link>
            <h2>Check your email</h2>
            <p className="text-muted-foreground sm:text-lg">
              A magic link has been sent to your email address. Please check
              your inbox to complete your login.
            </p>
          </div>
          <div className="flex gap-8 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/gmail.svg"
                alt="gmail icon"
                width={24}
                height={24}
              />
              <Link
                href="https://mail.google.com"
                target="_blank"
                className="hover:underline"
              >
                Open Gmail
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/outlook.svg"
                alt="outlook icon"
                width={24}
                height={24}
              />
              <Link
                href="https://outlook.live.com"
                target="_blank"
                className="hover:underline"
              >
                Open Outlook
              </Link>
            </div>
          </div>
          <div className="flex justify-center text-sm">
            <span className="text-center text-muted-foreground">
              Can&apos;t find your code? Check your spam folder!
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 text-center">
            <Link href="/">
              <Icons.logo className="mx-auto mb-6 size-8" />
            </Link>
            <h2>Sign in to {siteConfig.name}</h2>
            <p className="text-muted-foreground sm:text-lg">
              Use email to sign in to your account
            </p>
          </div>
          <UserAuthForm />
        </>
      )}
    </>
  )
}

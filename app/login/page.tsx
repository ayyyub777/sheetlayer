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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[480px]">
        {sent ? (
          <>
            <div className="flex flex-col gap-3 text-center">
              <Link href="/">
                <Icons.logo className="mx-auto mb-6 size-8" />
              </Link>
              <h2 className="font-heading text-4xl md:text-5xl">
                Check your email
              </h2>
              <p className="leading-normal text-muted-foreground sm:text-lg">
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
              <h2 className="font-heading text-4xl md:text-5xl">
                Sign in to {siteConfig.name}
              </h2>
              <p className="leading-normal text-muted-foreground sm:text-lg">
                Use email to sign in to your account
              </p>
            </div>
            <UserAuthForm />
          </>
        )}
      </div>
    </div>
  )
}

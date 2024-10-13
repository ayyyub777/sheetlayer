"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface SpreadsheetCreateButtonProps extends ButtonProps {}

export function SpreadsheetCreateButton({
  className,
  variant,
  ...props
}: SpreadsheetCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/spreadsheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Spreadsheet",
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        })
      }

      return toast({
        description: "Your spreadsheet was not created. Please try again.",
        variant: "destructive",
      })
    }

    const post = await response.json()

    router.refresh()
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      New API
    </button>
  )
}

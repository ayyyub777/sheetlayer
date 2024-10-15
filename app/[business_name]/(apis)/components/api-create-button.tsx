"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"

interface ApiCreateButtonProps extends ButtonProps {}

export function ApiCreateButton({
  className,
  variant,
  size,
  ...props
}: ApiCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const addApiModal = useAddApiModal()

  function onClick() {
    addApiModal.onOpen()
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant, size }),
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
      Create API
    </button>
  )
}

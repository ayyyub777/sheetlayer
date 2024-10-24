"use client"

import { useState } from "react"
import Link from "next/link"
import {
  cancelSub,
  pauseUserSubscription,
  unpauseUserSubscription,
  type getSubscriptionURLs,
} from "@/actions/subscription"
import { Subscription } from "@prisma/client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import Loading from "@/app/loading"

export function Operations({
  subscription,
  urls,
}: {
  subscription: Subscription
  urls: Awaited<ReturnType<typeof getSubscriptionURLs>>
}) {
  const [loading, setLoading] = useState(false)

  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null
  }

  if (loading) {
    return <Loading />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="size-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!subscription.isPaused && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              setLoading(true)
              await pauseUserSubscription(subscription.lemonSqueezyId).then(
                () => {
                  setLoading(false)
                }
              )
            }}
          >
            Pause payments
          </DropdownMenuItem>
        )}

        {subscription.isPaused && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              setLoading(true)
              await unpauseUserSubscription(subscription.lemonSqueezyId).then(
                () => {
                  setLoading(false)
                }
              )
            }}
          >
            Unpause payments
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href={urls?.update_payment_method}>Update payment method</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href={urls?.customer_portal}
            className="w-full flex justify-between items-center"
          >
            <p>Customer portal</p> <Icons.arrowUpRight className="size-3.5" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
          onClick={async () => {
            if (
              confirm(`Please confirm if you want to cancel your subscription.`)
            ) {
              setLoading(true)
              await cancelSub(subscription.lemonSqueezyId).then(() => {
                setLoading(false)
              })
            }
          }}
        >
          Cancel subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

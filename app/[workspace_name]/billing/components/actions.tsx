"use client"

import { useEffect, useState } from "react"
import { getSubscriptionURLs } from "@/actions/subscription"
import { Subscription } from "@prisma/client"

import { Operations } from "./operations"

export default function SubscriptionActions({
  subscription,
}: {
  subscription: Subscription
}) {
  const [urls, setUrls] = useState<any>(null)

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const urls = await getSubscriptionURLs(subscription.lemonSqueezyId)
        setUrls(urls)
      } catch (error) {
        console.error(error)
      }
    }

    fetchURLs()
  }, [subscription.lemonSqueezyId])

  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null
  }

  return <Operations subscription={subscription} urls={urls} />
}

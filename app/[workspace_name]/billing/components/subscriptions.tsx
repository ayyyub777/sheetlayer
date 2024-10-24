"use client"

import Link from "next/link"
import { Plan, Subscription } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import SubscriptionActions from "./actions"
import { SubscriptionDate } from "./date"
import Plans from "./plans"
import { SubscriptionPrice } from "./price"
import { SubscriptionStatus } from "./status"

export default function Subscriptions({
  userSubscriptions,
  allPlans,
}: {
  userSubscriptions: Subscription[]
  allPlans: Plan[]
}) {
  if (userSubscriptions.length === 0) {
    return <Plans allPlans={allPlans} />
  }

  const sortedSubscriptions = userSubscriptions.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") {
      return -1
    }

    if (a.status === "paused" && b.status === "cancelled") {
      return -1
    }

    return 0
  })

  return (
    <>
      {sortedSubscriptions.map((subscription, index) => {
        const plan = allPlans.find((p) => p.id === subscription.planId)
        const status = subscription.status

        if (!plan) {
          throw new Error("Plan not found")
        }

        return (
          <Card key={index} className="flex items-center justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <h1>Current plan ({plan.productName}) </h1>
                <SubscriptionStatus
                  statusFormatted={subscription.statusFormatted}
                  isPaused={Boolean(subscription.isPaused)}
                />
              </CardTitle>
              <CardDescription className="flex items-baseline gap-2">
                <SubscriptionPrice
                  endsAt={subscription.endsAt}
                  interval={plan.interval}
                  intervalCount={plan.intervalCount}
                  price={plan.price}
                  isUsageBased={plan.isUsageBased ?? false}
                />
                <SubscriptionDate
                  endsAt={subscription.endsAt}
                  renewsAt={subscription.renewsAt}
                  status={status}
                  trialEndsAt={subscription.trialEndsAt}
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mr-5">
              <div className="flex gap-2">
                <Link href={`billing/change-plans/${subscription.id}`}>
                  <Button variant="outline" size="sm">
                    Change plan
                  </Button>
                </Link>
                <SubscriptionActions subscription={subscription} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

import { getUserSubscriptions } from "@/actions/subscription"

import { db } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Price } from "./price"

export async function Subscriptions() {
  const userSubscriptions = (await getUserSubscriptions()) as any
  const allPlans = await db.plan.findMany()

  if (userSubscriptions.length === 0) {
    return (
      <p className="not-prose mb-2">
        It appears that you do not have any subscriptions. Please sign up for a
        plan below.
      </p>
    )
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
          <Card key={index}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2">
              <Price
                endsAt={subscription.endsAt}
                interval={plan.interval}
                intervalCount={plan.intervalCount}
                price={subscription.price}
                isUsageBased={plan.isUsageBased ?? false}
              />
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

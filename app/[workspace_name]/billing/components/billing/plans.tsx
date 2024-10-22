import { redirect } from "next/navigation"
import { syncPlans } from "@/actions/plan"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { UpgradeButton } from "./upgrade-button"

export async function Plans() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  let allPlans = await db.plan.findMany()

  if (!allPlans.length) {
    allPlans = await syncPlans()
  }

  if (!allPlans.length) {
    return <p>No plans available.</p>
  }
  return (
    <>
      {allPlans.map((plan, index) => {
        return (
          <Card key={`plan-${index}`}>
            <CardHeader>
              <CardTitle>{plan.productName}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2">
              <h4 className="h4">${(Number(plan.price) / 100).toFixed(2)}</h4>
              <p className="text-sm">per {plan.interval}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
              <UpgradeButton plan={plan} />
            </CardFooter>
          </Card>
        )
      })}
    </>
  )
}

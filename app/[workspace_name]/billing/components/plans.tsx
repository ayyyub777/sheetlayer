import { Plan } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { UpgradeButton } from "./upgrade-button"

export default function Plans({
  allPlans,
  currentPlan,
  isChangingPlans = false,
}: {
  allPlans: Plan[]
  currentPlan?: Plan
  isChangingPlans?: boolean
}) {
  if (!allPlans) {
    return <p>No plans available.</p>
  } else {
    return (
      <>
        {allPlans.map((plan, index) => (
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
              {currentPlan?.id === plan.id ? (
                <Button variant="secondary" size="sm">
                  Current plan
                </Button>
              ) : (
                <UpgradeButton plan={plan} isChangingPlans={isChangingPlans} />
              )}
            </CardFooter>
          </Card>
        ))}
      </>
    )
  }
}

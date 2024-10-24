import { Plan } from "@prisma/client"

import { getPlanByName, plans } from "@/config/plans"
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

const PlanFeatures = ({ productName }: { productName: string | null }) => {
  const planDetails = plans[productName || ""]

  if (!planDetails) return null

  return (
    <ul className="text-sm mt-4 space-y-2">
      {planDetails.features.map((feature, index) => (
        <li key={`feature-${index}`}>
          <span className="font-semibold">{feature.name}</span>: {feature.value}
        </li>
      ))}
    </ul>
  )
}

const PlanPrice = ({
  price,
  interval,
}: {
  price: number
  interval: string | null
}) => (
  <div className="flex items-baseline gap-2">
    <h4 className="h4">${(price / 100).toFixed(2)}</h4>
    <p className="text-sm">per {interval}</p>
  </div>
)

export default function Plans({
  allPlans,
  currentPlan,
  isChangingPlans = false,
}: {
  allPlans: Plan[]
  currentPlan?: Plan
  isChangingPlans?: boolean
}) {
  if (!allPlans || allPlans.length === 0) {
    return <p>No plans available.</p>
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {allPlans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.productName}</CardTitle>
            <CardDescription>
              {getPlanByName(plan.productName)?.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PlanPrice price={Number(plan.price)} interval={plan.interval} />
            {/* <PlanFeatures productName={plan.productName} /> */}
          </CardContent>

          <CardFooter>
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
    </div>
  )
}

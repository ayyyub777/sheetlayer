import { notFound } from "next/navigation"
import { getPlans } from "@/actions/plan"
import { getUserSubscriptions } from "@/actions/subscription"

import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import Plans from "../../components/plans"

export const dynamic = "force-dynamic"

export default async function ChangePlansPage({
  params,
}: {
  params: { id?: string }
}) {
  if (!params.id) {
    notFound()
  }
  const currentPlanId = parseInt(params.id)

  if (isNaN(currentPlanId)) {
    notFound()
  }

  const userSubscriptions = await getUserSubscriptions()

  if (!userSubscriptions) {
    notFound()
  }

  const currentPlan = await db.plan.findUnique({
    where: {
      id: currentPlanId,
    },
  })

  if (!currentPlan) {
    notFound()
  }

  const allPlans = await getPlans()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Change Plans"
        text="Choose a plan that works for you."
      />
      <Plans currentPlan={currentPlan} allPlans={allPlans} />
    </DashboardShell>
  )
}

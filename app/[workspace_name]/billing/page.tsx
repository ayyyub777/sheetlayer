// @ts-nocheck

import { Suspense } from "react"
import { getPlans } from "@/actions/plan"
import { getUserSubscriptions } from "@/actions/subscription"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import Subscriptions from "./components/subscriptions"

export const metadata = {
  title: "Billing",
}

export default async function BillingPage() {
  const userSubscriptions = await getUserSubscriptions()
  const allPlans = await getPlans()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <Subscriptions
          userSubscriptions={userSubscriptions}
          allPlans={allPlans}
        />
      </div>
    </DashboardShell>
  )
}

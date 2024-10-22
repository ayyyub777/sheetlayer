// @ts-nocheck

import { Suspense } from "react"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { Plans } from "./components/billing/plans"
import { Subscriptions } from "./components/subscription/subscriptions"

export const metadata = {
  title: "Billing",
}

export default async function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div>
        <Suspense fallback={<></>}>
          <Subscriptions />
        </Suspense>

        <Suspense fallback={<></>}>
          <Plans />
        </Suspense>
      </div>
    </DashboardShell>
  )
}

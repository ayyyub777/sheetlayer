// @ts-nocheck

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCheckoutURL } from "@/actions/plan"
import { Plan } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function UpgradeButton(props: {
  plan: Plan
  currentPlan?: Plan
  embed?: boolean
}) {
  const { plan, currentPlan, embed = false } = props
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isCurrent = plan.id === currentPlan?.id

  const label = isCurrent ? "Current plan" : "Upgrade plan"

  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy()
    }
  }, [])

  const handleCheckout = async () => {
    let checkoutUrl: string | undefined = ""

    try {
      setLoading(true)
      checkoutUrl = await getCheckoutURL(plan.variantId, embed)
    } catch (error) {
      toast({
        description: "Error creating a checkout. Please try again later.",
      })
    } finally {
      embed && setLoading(false)
    }

    embed
      ? checkoutUrl && LemonSqueezy.Url.Open(checkoutUrl)
      : router.push(checkoutUrl ?? "/")
  }

  return (
    <Button disabled={loading || isCurrent} onClick={handleCheckout}>
      {label}
    </Button>
  )
}

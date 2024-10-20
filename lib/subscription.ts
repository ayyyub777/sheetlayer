// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "types"
import { freePlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  // const user = await db.user.findFirst({
  //   where: {
  //     id: userId,
  //   },
  //   select: {
  //     SubscriptionId: true,
  //     CurrentPeriodEnd: true,
  //     CustomerId: true,
  //     PriceId: true,
  //   },
  // })

  // if (!user) {
  //   throw new Error("User not found")
  // }

  // Fake user data for demo purposes.
  const user = {
    subscriptionId: null,
    currentPeriodEnd: null,
    customerId: null,
    priceId: null,
  }

  const isPro =
    user.priceId && user.currentPeriodEnd?.getTime() + 86_400_000 > Date.now()

  const plan = isPro ? proPlan : freePlan

  return {
    ...plan,
    ...user,
    currentPeriodEnd: user.currentPeriodEnd?.getTime(),
    isPro,
  }
}

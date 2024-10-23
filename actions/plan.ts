"use server"

import { revalidatePath } from "next/cache"
import {
  createCheckout,
  getProduct,
  listPrices,
  listProducts,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js"
import { Subscription } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { configureLemonSqueezy } from "@/lib/lemonsqueezy"

import { getUserSubscriptionById } from "./subscription"

export async function syncPlans() {
  configureLemonSqueezy()

  const productVariants = await db.plan.findMany()

  async function _addVariant(variant) {
    await db.plan.upsert({
      where: { variantId: variant.variantId },
      update: variant,
      create: variant,
    })
    productVariants.push(variant)
  }

  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  })

  const allVariants = products.data?.included

  if (allVariants) {
    for (const v of allVariants) {
      const variant = v.attributes as any
      if (
        variant.status === "draft" ||
        (allVariants.length !== 1 && variant.status === "pending")
      ) {
        continue
      }

      const productName =
        (await getProduct(variant.product_id)).data?.data.attributes.name ?? ""

      const variantPriceObject = await listPrices({
        filter: {
          variantId: v.id,
        },
      })

      const currentPriceObj = variantPriceObject.data?.data.at(0)
      const isUsageBased =
        currentPriceObj?.attributes.usage_aggregation !== null
      const interval = currentPriceObj?.attributes.renewal_interval_unit
      const intervalCount =
        currentPriceObj?.attributes.renewal_interval_quantity
      const trialInterval = currentPriceObj?.attributes.trial_interval_unit
      const trialIntervalCount =
        currentPriceObj?.attributes.trial_interval_quantity

      const price = isUsageBased
        ? currentPriceObj?.attributes.unit_price_decimal
        : currentPriceObj.attributes.unit_price

      const priceString = price !== null ? price?.toString() ?? "" : ""

      const isSubscription =
        currentPriceObj?.attributes.category === "subscription"

      if (!isSubscription) {
        continue
      }

      await _addVariant({
        name: variant.name,
        description: variant.description,
        price: priceString,
        interval,
        intervalCount,
        isUsageBased,
        productId: variant.product_id,
        productName,
        variantId: parseInt(v.id) as unknown as number,
        trialInterval,
        trialIntervalCount,
        sort: variant.sort,
      })
    }
  }

  return productVariants
}

export async function getPlans() {
  const plans = await db.plan.findMany()

  if (!plans.length) {
    await syncPlans()
  }

  return plans
}

export async function getCheckoutURL(variantId: number, embed = false) {
  configureLemonSqueezy()

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutOptions: {
        embed,
        media: false,
        logo: !embed,
      },
      checkoutData: {
        email: session.user.email ?? undefined,
        custom: {
          user_id: session.user.id,
        },
      },
      productOptions: {
        enabledVariants: [variantId],
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you for your purchase!",
      },
    }
  )

  return checkout.data?.data.attributes.url
}

export async function changePlan(currentPlanId: number, newPlanId: number) {
  configureLemonSqueezy()

  const subscription = (await getUserSubscriptionById(
    currentPlanId.toString()
  )) as Subscription

  if (!subscription) {
    throw new Error(`No subscription with plan id #${currentPlanId} was found.`)
  }

  const newPlan = await db.plan.findUniqueOrThrow({
    where: {
      id: newPlanId,
    },
  })

  const updatedSub = await updateSubscription(subscription.lemonSqueezyId, {
    variantId: newPlan.variantId,
  })

  try {
    await db.subscription.update({
      where: {
        lemonSqueezyId: subscription.lemonSqueezyId,
      },
      data: {
        planId: newPlanId,
        price: newPlan.price,
        endsAt: updatedSub.data?.data.attributes.ends_at,
      },
    })
  } catch (error) {
    throw new Error(
      `Failed to update Subscription #${subscription.lemonSqueezyId} in the database.`
    )
  }

  revalidatePath("/")

  return updatedSub
}

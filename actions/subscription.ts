"use server"

import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import {
  cancelSubscription,
  getSubscription,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js"

import { db } from "@/lib/db"
import { configureLemonSqueezy } from "@/lib/lemonsqueezy"

import { getUserId } from "./user"

export async function getUserSubscriptions() {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  if (!userId) {
    notFound()
  }

  const userSubscriptions = await db.subscription.findMany({
    where: {
      userId,
    },
  })
  revalidatePath("/")

  return userSubscriptions
}

export async function getUserSubscriptionById(lemonSqueezyId: string) {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const userSubscription = await db.subscription.findFirst({
    where: {
      userId,
      lemonSqueezyId,
    },
  })

  return userSubscription
}

export async function cancelSub(id: string) {
  configureLemonSqueezy()

  const subscription = await getUserSubscriptionById(id)

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`)
  }

  const cancelledSub = await cancelSubscription(id)

  if (cancelledSub.error) {
    throw new Error(cancelledSub.error.message)
  }

  try {
    await db.subscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: cancelledSub.data?.data.attributes.status,
        statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
        endsAt: cancelledSub.data?.data.attributes.ends_at,
      },
    })
  } catch (error) {
    throw new Error(`Failed to cancel Subscription #${id} in the database.`)
  }

  revalidatePath("/")

  return cancelledSub
}

export async function pauseUserSubscription(id: string) {
  configureLemonSqueezy()

  const subscription = await getUserSubscriptionById(id)

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`)
  }

  const returnedSub = await updateSubscription(id, {
    pause: {
      mode: "void",
    },
  })

  try {
    await db.subscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
      },
    })
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`)
  }

  revalidatePath("/")

  return returnedSub
}

export async function unpauseUserSubscription(id: string) {
  configureLemonSqueezy()

  const subscription = await getUserSubscriptionById(id)

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`)
  }

  const returnedSub = await updateSubscription(id, {
    pause: null,
  })

  try {
    await db.subscription.update({
      where: {
        lemonSqueezyId: id,
      },
      data: {
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
      },
    })
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`)
  }

  revalidatePath("/")

  return returnedSub
}

export async function getSubscriptionURLs(id: string) {
  configureLemonSqueezy()
  const subscription = await getSubscription(id)

  if (subscription.error) {
    throw new Error(subscription.error.message)
  }

  return subscription.data?.data.attributes.urls
}

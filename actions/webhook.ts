"use server"

import crypto from "node:crypto"
import { getPrice } from "@lemonsqueezy/lemonsqueezy.js"

import { db } from "@/lib/db"
import { configureLemonSqueezy } from "@/lib/lemonsqueezy"
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards"

export async function processWebhookEvent(webhookEvent) {
  configureLemonSqueezy()

  const dbwebhookEvent = await db.webhookEvent.findUnique({
    where: {
      id: webhookEvent.id,
    },
  })

  if (!dbwebhookEvent) {
    throw new Error(
      `Webhook event #${webhookEvent.id} not found in the database.`
    )
  }

  if (!process.env.WEBHOOK_URL) {
    throw new Error(
      "Missing required WEBHOOK_URL env variable. Please, set it in your .env file."
    )
  }

  let processingError = ""
  const eventBody = webhookEvent.body

  if (!webhookHasMeta(eventBody)) {
    processingError = "Event body is missing the 'meta' property."
  } else if (webhookHasData(eventBody)) {
    if (webhookEvent.eventName.startsWith("subscription_payment_")) {
      // Save subscription invoices; eventBody is a SubscriptionInvoice
      // Not implemented.
    } else if (webhookEvent.eventName.startsWith("subscription_")) {
      // Save subscription events; obj is a Subscription
      const attributes = eventBody.data.attributes
      const variantId = attributes.variant_id as string

      // Fetch the plan by variantId
      const plan = await db.plan.findUnique({
        where: {
          variantId: parseInt(variantId, 10),
        },
      })

      if (!plan) {
        processingError = `Plan with variantId ${variantId} not found.`
      } else {
        // Update the subscription in the database.
        const priceId = attributes.first_subscription_item.price_id

        // Get the price data from Lemon Squeezy.
        const priceData = await getPrice(priceId)
        if (priceData.error) {
          processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`
        }

        const isUsageBased = attributes.first_subscription_item.is_usage_based
        const price = isUsageBased
          ? priceData.data?.data.attributes.unit_price_decimal
          : priceData.data?.data.attributes.unit_price

        const updateData = {
          lemonSqueezyId: eventBody.data.id,
          orderId: attributes.order_id as number,
          name: attributes.user_name as string,
          email: attributes.user_email as string,
          status: attributes.status as string,
          statusFormatted: attributes.status_formatted as string,
          renewsAt: attributes.renews_at as string,
          endsAt: attributes.ends_at as string,
          trialEndsAt: attributes.trial_ends_at as string,
          price: price?.toString() ?? "",
          isPaused: false,
          subscriptionItemId: attributes.first_subscription_item.id,
          isUsageBased: attributes.first_subscription_item.is_usage_based,
          userId: eventBody.meta.custom_data.user_id,
          planId: plan.id,
        }

        // Create/update subscription in the database.
        try {
          await db.subscription.upsert({
            where: { lemonSqueezyId: updateData.lemonSqueezyId },
            create: updateData,
            update: updateData,
          })
        } catch (error) {
          processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`
          console.error(error)
        }
      }
    } else if (webhookEvent.eventName.startsWith("order_")) {
      // Save orders; eventBody is a "Order"
      /* Not implemented */
    } else if (webhookEvent.eventName.startsWith("license_")) {
      // Save license keys; eventBody is a "License key"
      /* Not implemented */
    }

    // Update the webhook event in the database.
    await db.webhookEvent.update({
      where: {
        id: webhookEvent.id,
      },
      data: {
        processed: true,
        processingError,
      },
    })
  }
}

export async function storeWebhookEvent(eventName: string, body) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  const id = crypto.randomInt(100000000, 1000000000)

  const returnedValue = await db.webhookEvent.create({
    data: {
      id,
      eventName,
      processed: false,
      body,
    },
  })

  return returnedValue[0]
}

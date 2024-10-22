"use server"

import crypto from "node:crypto"
import { getPrice } from "@lemonsqueezy/lemonsqueezy.js"

import { db } from "@/lib/db"
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards"

export async function processWebhookEvent(webhookEventId: number) {
  try {
    // Fetch the complete webhook event from the database
    const webhookEvent = await db.webhookEvent.findUnique({
      where: {
        id: webhookEventId,
      },
    })

    if (!webhookEvent) {
      throw new Error(
        `Webhook event #${webhookEventId} not found in the database.`
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
        try {
          const attributes = eventBody.data.attributes
          const variantId = attributes.variant_id as string

          // Fetch the plan by variantId
          const plan = await db.plan.findUnique({
            where: {
              variantId: parseInt(variantId, 10),
            },
          })

          if (!plan) {
            throw new Error(`Plan with variantId ${variantId} not found.`)
          }

          // Update the subscription in the database
          const priceId = attributes.first_subscription_item?.price_id
          if (!priceId) {
            throw new Error("Price ID is missing from subscription item")
          }

          // Get the price data from Lemon Squeezy
          const priceData = await getPrice(priceId)
          if (priceData.error) {
            throw new Error(
              `Failed to get the price data for the subscription ${eventBody.data.id}.`
            )
          }

          const isUsageBased =
            attributes.first_subscription_item?.is_usage_based ?? false
          const price = isUsageBased
            ? priceData.data?.data.attributes.unit_price_decimal
            : priceData.data?.data.attributes.unit_price

          if (!price) {
            throw new Error("Failed to determine price for subscription")
          }

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
            price: price.toString(),
            isPaused: false,
            subscriptionItemId: attributes.first_subscription_item.id,
            isUsageBased: attributes.first_subscription_item.is_usage_based,
            userId: eventBody.meta.custom_data.user_id,
            planId: plan.id,
          }

          await db.subscription.upsert({
            where: { lemonSqueezyId: updateData.lemonSqueezyId },
            create: updateData,
            update: updateData,
          })
        } catch (error) {
          processingError =
            error instanceof Error
              ? error.message
              : `Failed to process subscription webhook event ${webhookEventId}`
          console.error(error)
        }
      } else if (webhookEvent.eventName.startsWith("order_")) {
        // Save orders; eventBody is a "Order"
        /* Not implemented */
      } else if (webhookEvent.eventName.startsWith("license_")) {
        // Save license keys; eventBody is a "License key"
        /* Not implemented */
      }
    }

    // Update the webhook event in the database
    await db.webhookEvent.update({
      where: {
        id: webhookEventId,
      },
      data: {
        processed: true,
        processingError,
      },
    })
  } catch (error) {
    console.error("Error processing webhook event:", error)

    // Update the webhook event with the error
    await db.webhookEvent.update({
      where: {
        id: webhookEventId,
      },
      data: {
        processed: true,
        processingError:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    })

    throw error
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

  return returnedValue[0].id
}

"use server"

import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"

import { db } from "@/lib/db"

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

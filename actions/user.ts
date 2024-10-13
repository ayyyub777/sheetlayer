"use server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }
  return session.user.id
}

export async function completeSetup() {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        setup: true,
      },
    })
    return {
      success: {
        description: "Setup Complete",
      },
    }
  } catch (error) {
    console.error("Error fetching name:", error)
    return {
      error: {
        description:
          "We encountered an issue. Please try again later or contact support if the problem persists.",
      },
    }
  }
}

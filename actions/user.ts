"use server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function completeSetup() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return {
      error: {
        title: "Authentication Required",
        description: "Please sign in to update.",
      },
    }
  }
  const userId = session.user.id

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
        title: "Setup Complete",
        description: "You have successfully completed the setup process.",
      },
    }
  } catch (error) {
    console.error("Error fetching name:", error)
    return {
      error: {
        title: "Fetch Failed",
        description:
          "We encountered an issue. Please try again later or contact support if the problem persists.",
      },
    }
  }
}

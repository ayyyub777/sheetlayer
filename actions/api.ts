"use server"

import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"

export const getApis = async (): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const apis = await db.api.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return {
    success: {
      data: apis,
    },
  }
}

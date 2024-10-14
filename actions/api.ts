"use server"

import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"

export const getApis = async (business_name): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  if (!business_name) {
    return {
      error: {
        description: "Business name is required",
      },
    }
  }

  const business = await db.business.findFirst({
    where: {
      name: business_name,
      userId,
    },
  })

  if (!business) {
    return {
      error: {
        description: "Business not found",
      },
    }
  }

  const apis = await db.api.findMany({
    where: {
      businessId: business.id,
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

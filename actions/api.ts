"use server"

import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"

export const getApis = async (workspace_name): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  if (!workspace_name) {
    return {
      error: {
        description: "workspace name is required",
      },
    }
  }

  const workspace = await db.workspace.findFirst({
    where: {
      name: workspace_name,
      userId,
    },
  })

  if (!workspace) {
    return {
      error: {
        description: "workspace not found",
      },
    }
  }

  const apis = await db.api.findMany({
    where: {
      workspaceId: workspace.id,
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

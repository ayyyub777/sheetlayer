"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"
import { workspaceNameSchema } from "@/schemas/workspace"

export const addWorkspace = async (
  values: z.infer<typeof workspaceNameSchema>
): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const validatedFields = workspaceNameSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: {
        description: "Please provide valid workspace name.",
      },
    }
  }

  try {
    await db.workspace.create({
      data: {
        name: values.name.toLowerCase(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    return {
      success: {
        description: "Your workspace name has been updated successfully.",
      },
    }
  } catch (error) {
    console.error("Failed to update workspace name:", error)
    return {
      error: {
        description: "An error occurred while updating your workspace name.",
      },
    }
  }
}

const updateWorkspaceNameSchema = z.object({
  name: z.string(),
  workspace_name: z.string(),
})

export const updateWorkspaceName = async (
  values: z.infer<typeof updateWorkspaceNameSchema>
): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const validatedFields = workspaceNameSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: {
        description: "Please provide valid workspace name.",
      },
    }
  }

  try {
    await db.workspace.update({
      where: {
        name: values.workspace_name,
        userId,
      },
      data: {
        name: values.name.toLowerCase(),
      },
    })
    return {
      success: {
        description: "Your workspace name has been updated successfully.",
      },
    }
  } catch (error) {
    console.error("Failed to update workspace name:", error)
    return {
      error: {
        description: "An error occurred while updating your workspace name.",
      },
    }
  }
}

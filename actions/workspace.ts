"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"

const workspaceNameSchema = z.object({
  name: z.string().nonempty("workspace name is required"),
})

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

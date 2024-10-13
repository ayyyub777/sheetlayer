"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { StatusResponseType } from "@/types"
import { getUserId } from "./user"

const businessNameSchema = z.object({
  name: z.string().nonempty("Business name is required"),
})

export const setBusinessName = async (
  values: z.infer<typeof businessNameSchema>
): Promise<StatusResponseType> => {
  const userId = await getUserId()
  if (!userId) {
    return {
      error: {
        description: "Authentication Required",
      },
    }
  }

  const validatedFields = businessNameSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: {
        description: "Please provide valid business name.",
      },
    }
  }

  try {
    await db.business.create({
      data: {
        name: values.name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    return {
      success: {
        description: "Your business name has been updated successfully.",
      },
    }
  } catch (error) {
    console.error("Failed to update business name:", error)
    return {
      error: {
        description: "An error occurred while updating your business name.",
      },
    }
  }
}

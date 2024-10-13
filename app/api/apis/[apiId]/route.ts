import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const routeContextSchema = z.object({
  params: z.object({
    apiId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToPost(params.apiId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.api.delete({
      where: {
        id: params.apiId as string,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.api.count({
    where: {
      id: postId,
      userId: session?.user.id,
    },
  })

  return count > 0
}

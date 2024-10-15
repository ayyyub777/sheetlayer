import * as z from "zod"
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

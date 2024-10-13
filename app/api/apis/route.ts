import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const apiCreateSchema = z.object({
  title: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = session
    const apis = await db.api.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      where: {
        userId: user.id,
      },
    })

    return NextResponse.json(apis, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = session

    const json = await req.json()
    const body = apiCreateSchema.parse(json)

    const post = await db.api.create({
      data: {
        title: body.title,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
      })
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

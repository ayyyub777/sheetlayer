import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { createSpreadsheet } from "@/actions/spreadsheet"
import { refreshAccessTokenIfNeeded } from "@/actions/refresh-token"

const apiCreateSchema = z.object({
  title: z.string(),
  businessName: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        connections: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      user.id,
      "google_sheets"
    )

    if (!accessToken) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      )
    }

    const json = await req.json()
    const body = apiCreateSchema.parse(json)

    const spreadsheet = await createSpreadsheet(accessToken, body.title)

    if (!spreadsheet) {
      return NextResponse.json(
        { error: "Failed to create spreadsheet" },
        { status: 400 }
      )
    }

    const business = await db.business.findFirst({
      where: {
        userId: user.id,
        name: body.businessName,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const existingApi = await db.api.findFirst({
      where: {
        title: body.title.toLowerCase(),
        businessId: business.id,
      },
    })

    if (existingApi) {
      return NextResponse.json({ error: "API already exists" }, { status: 409 })
    }

    const api = await db.api.create({
      data: {
        title: body.title.toLowerCase(),
        businessId: business.id,
        spreadsheet: spreadsheet.spreadsheetId,
      },
      select: {
        id: true,
        spreadsheet: true,
      },
    })

    return NextResponse.json({ api }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Bad Request", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

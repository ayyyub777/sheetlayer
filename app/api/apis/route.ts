import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { createSpreadsheet } from "@/actions/spreadsheet"

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

    const spreadsheetConnection = await db.connection.findFirst({
      where: {
        userId: user.id,
        provider: "google_sheets",
      },
    })

    if (!spreadsheetConnection || !spreadsheetConnection.accessToken) {
      return NextResponse.json(
        { error: "Google Sheets connection required" },
        { status: 400 }
      )
    }

    const json = await req.json()
    const body = apiCreateSchema.parse(json)

    const spreadsheet = await createSpreadsheet(
      spreadsheetConnection.accessToken,
      body.title
    )

    if (!spreadsheet) {
      return NextResponse.json(
        { error: "Failed to create spreadsheet" },
        { status: 400 }
      )
    }

    const business = await db.business.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const api = await db.api.create({
      data: {
        title: body.title.toLowerCase(),
        userId: session.user.id,
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

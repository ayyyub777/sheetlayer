import { refreshAccessTokenIfNeeded } from "@/actions/refresh-token"
import { getSpreadsheetData } from "@/actions/spreadsheet"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

function convertSpreadsheetDataToJson(spreadsheetData) {
  if (
    !spreadsheetData ||
    !Array.isArray(spreadsheetData) ||
    spreadsheetData.length < 2
  ) {
    return []
  }

  const [keys, ...rows] = spreadsheetData
  return rows.map((row) => {
    return row.reduce((obj, value, index) => {
      obj[keys[index]] = value
      return obj
    }, {})
  })
}

export async function GET(req: Request, { params }) {
  const { business_name, api_title } = params
  try {
    const business = await db.business.findUnique({
      where: {
        name: business_name,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const api = await db.api.findFirst({
      where: {
        title: api_title,
        userId: business.userId,
      },
      include: {
        user: {
          include: {
            connections: {
              where: { provider: "google_sheets" },
            },
          },
        },
      },
    })

    if (!api || !api.user.connections.length) {
      return NextResponse.json(
        { error: "API or connection not found" },
        { status: 404 }
      )
    }

    const spreadsheetId = api.spreadsheet
    const accessToken = await refreshAccessTokenIfNeeded(
      business.userId,
      "google_sheets"
    )

    if (!accessToken || !spreadsheetId) {
      return NextResponse.json(
        { error: "Connection or spreadsheet not found" },
        { status: 404 }
      )
    }

    const data = await getSpreadsheetData(accessToken, spreadsheetId, "Sheet1")
    const response = convertSpreadsheetDataToJson(data)
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

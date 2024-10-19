import { refreshAccessTokenIfNeeded } from "@/actions/refresh-token"
import { getSpreadsheetData } from "@/actions/spreadsheet"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

function convertSpreadsheetDataToJson(spreadsheetData) {
  if (
    !spreadsheetData ||
    typeof spreadsheetData !== "object" ||
    Object.keys(spreadsheetData).length === 0
  ) {
    return []
  }

  const result = {}

  for (const sheet in spreadsheetData) {
    const data = spreadsheetData[sheet]

    if (Array.isArray(data) && data.length >= 2) {
      const [keys, ...rows] = data

      result[sheet] = rows.map((row) => {
        return row.reduce((obj, value, index) => {
          obj[keys[index]] = value
          return obj
        }, {})
      })
    } else {
      result[sheet] = []
    }
  }

  return result
}

export async function GET(req: Request, { params }) {
  const { workspace_name, api_title } = params
  try {
    const workspace = await db.workspace.findUnique({
      where: {
        name: workspace_name,
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: "workspace not found" },
        { status: 404 }
      )
    }

    const api = await db.api.findFirst({
      where: {
        title: api_title,
        workspaceId: workspace.id,
      },
    })

    if (!api) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    const spreadsheetId = api.spreadsheet
    const accessToken = await refreshAccessTokenIfNeeded(
      workspace.userId,
      "google_sheets"
    )

    if (!accessToken || !spreadsheetId) {
      return NextResponse.json(
        { error: "Connection or spreadsheet not found" },
        { status: 404 }
      )
    }

    const data = await getSpreadsheetData(accessToken, spreadsheetId)
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

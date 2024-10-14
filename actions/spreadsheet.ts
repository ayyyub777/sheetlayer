"use server"

import { google, sheets_v4 } from "googleapis"
import { OAuth2Client } from "google-auth-library"

function getOAuth2Client(accessToken: string): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  return oauth2Client
}

type SheetData = (string | number | boolean | null)[][]

interface AllSheetData {
  [sheetName: string]: SheetData
}

export async function getSpreadsheetData(
  accessToken: string,
  spreadsheetId: string
): Promise<AllSheetData> {
  const auth = getOAuth2Client(accessToken)
  const sheets = google.sheets({ version: "v4", auth })

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  const sheetNames =
    metadata.data.sheets?.map((sheet) => sheet.properties?.title as string) ||
    []

  const allData: AllSheetData = {}

  for (const sheetName of sheetNames) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    })

    allData[sheetName] = response.data.values || []
  }

  return allData
}

interface CreateSpreadsheetResult {
  spreadsheetId: string
  spreadsheetUrl: string
}

export async function createSpreadsheet(
  accessToken: string,
  title: string
): Promise<CreateSpreadsheetResult> {
  const auth = getOAuth2Client(accessToken)
  const sheets = google.sheets({ version: "v4", auth })

  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title,
      },
    },
  })

  const spreadsheetId = response.data.spreadsheetId
  const spreadsheetUrl = response.data.spreadsheetUrl

  if (!spreadsheetId || !spreadsheetUrl) {
    throw new Error("Failed to create the spreadsheet")
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
  }
}

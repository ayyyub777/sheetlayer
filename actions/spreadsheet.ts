"use server"

import { google } from "googleapis"

function getOAuth2Client(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  return oauth2Client
}

export async function getSpreadsheetMetadata(auth: any, spreadsheetId: string) {
  const sheets = google.sheets({ version: "v4", auth })
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  return response.data
}

export async function getSpreadsheetData(accessToken, spreadsheetId, range) {
  const auth = getOAuth2Client(accessToken)
  const sheets = google.sheets({ version: "v4", auth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  return response.data.values
}

export async function createSpreadsheet(accessToken: string, title: string) {
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
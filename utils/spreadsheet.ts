import { google } from "googleapis";

function getOAuth2Client(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return oauth2Client;
}

export async function getSpreadsheetData(accessToken, spreadsheetId, range) {
  const auth = getOAuth2Client(accessToken);
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
}

export async function insertSpreadsheetData(
  accessToken,
  spreadsheetId,
  range,
  values
) {
  const auth = getOAuth2Client(accessToken);
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

  return response.data;
}

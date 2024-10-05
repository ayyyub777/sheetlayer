import { NextResponse } from "next/server";
import { getSpreadsheetData, insertSpreadsheetData } from "@/utils/spreadsheet";
import { auth } from "@/auth";

const getAccessToken = async () => {
  const session = await auth();
  const user = session || {};
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.accessToken === undefined) {
    return NextResponse.json(
      { error: "Access token is undefined" },
      { status: 401 }
    );
  }
  return user.accessToken;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get("spreadsheetId");
  const range = searchParams.get("range");

  const accessToken = await getAccessToken();

  try {
    const data = await getSpreadsheetData(accessToken, spreadsheetId, range);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { spreadsheetId, range, values } = await request.json();
  const accessToken = await getAccessToken();

  try {
    const result = await insertSpreadsheetData(
      accessToken,
      spreadsheetId,
      range,
      values
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

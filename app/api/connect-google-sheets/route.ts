import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { google } from "googleapis"
import { authOptions } from "@/lib/auth"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/google-sheets-callback`
)

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const scopes = ["https://www.googleapis.com/auth/spreadsheets"]
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  })

  return NextResponse.json({ url })
}

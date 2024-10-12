import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { google } from "googleapis"
import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.NEXTAUTH_URL}/api/google-sheets-callback`
)

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    await db.connection.create({
      data: {
        provider: "google_sheets",
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiresAt: new Date(tokens.expiry_date!),
        userId: session.user.id,
      },
    })

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Error connecting Google Sheets:", error)
    return NextResponse.redirect(
      new URL("/dashboard?error=connection_failed", request.url)
    )
  }
}

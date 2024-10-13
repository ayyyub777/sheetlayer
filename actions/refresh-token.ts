"use server"

import { db } from "@/lib/db"
import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL
)

export async function refreshAccessTokenIfNeeded(
  userId: string,
  provider: string
) {
  const connection = await db.connection.findUnique({
    where: {
      provider_user_unique: {
        provider,
        userId,
      },
    },
  })

  if (!connection) {
    throw new Error("No connection found for this user and provider")
  }

  const currentTime = new Date()

  if (connection.expiresAt && currentTime >= connection.expiresAt) {
    oauth2Client.setCredentials({
      refresh_token: connection.refreshToken,
    })

    try {
      const { credentials } = await oauth2Client.refreshAccessToken()

      await db.connection.update({
        where: {
          provider_user_unique: {
            provider,
            userId,
          },
        },
        data: {
          accessToken: credentials.access_token!,
          expiresAt: new Date(credentials.expiry_date!),
        },
      })

      return credentials.access_token
    } catch (error) {
      console.error("Error refreshing access token", error)
      throw new Error("Failed to refresh access token")
    }
  }

  return connection.accessToken
}

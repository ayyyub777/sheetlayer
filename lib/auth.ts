import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { env } from "@/env.mjs"
import { db } from "@/lib/db"

const sesClient = new SESClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: { email: identifier },
          select: { emailVerified: true },
        })

        const subject = user?.emailVerified
          ? "Sign In to Your Account"
          : "Activate Your Account"
        const bodyText = `Click the following link to ${
          user?.emailVerified ? "sign in" : "activate your account"
        }: ${url}`

        const params = {
          Source: provider.from as string,
          Destination: { ToAddresses: [identifier] },
          Message: {
            Subject: { Data: subject },
            Body: { Text: { Data: bodyText } },
          },
        }

        if (process.env.NODE_ENV === "development") {
          console.log(`Subject: ${subject}`)
          console.log(`Body: ${bodyText}`)
          console.log(`To: ${identifier}`)
          return
        }

        try {
          await sesClient.send(new SendEmailCommand(params))
        } catch (error) {
          console.error("Error sending email via SES:", error)
          throw new Error("Could not send email")
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.picture = token.picture || undefined
        session.user.setup = token.setup
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: { email: token.email },
      })

      if (!dbUser) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture,
        setup: dbUser.setup,
      }
    },
  },
}

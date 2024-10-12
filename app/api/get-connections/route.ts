import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const connections = await db.connection.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        provider: true,
      },
    })

    const providers = connections.map((connection) => connection.provider)

    return NextResponse.json(providers, { status: 200 })
  } catch (error) {
    console.error("Error fetching connected sheets:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

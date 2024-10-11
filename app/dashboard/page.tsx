import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { SpreadsheetCreateButton } from "@/components/spreadsheet-create-button"
import { SpreadsheetItem } from "@/components/spreadsheet-item"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const spreadsheets = await db.spreadsheet.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="API's" text="Create and manage API's.">
        <SpreadsheetCreateButton />
      </DashboardHeader>
      <div>
        {spreadsheets?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {spreadsheets.map((spreadsheet) => (
              <SpreadsheetItem key={spreadsheet.id} spreadsheet={spreadsheet} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="empty" />
            <EmptyPlaceholder.Title>No API's created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any API's yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

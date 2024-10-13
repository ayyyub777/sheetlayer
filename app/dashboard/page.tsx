import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ApiCreateButton } from "@/components/api-create-button"
import { ApiItem } from "@/components/api-item"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const apis = await db.api.findMany({
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
        <ApiCreateButton />
      </DashboardHeader>
      <div>
        {apis?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {apis.map((api) => (
              <ApiItem key={api.id} api={api} />
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

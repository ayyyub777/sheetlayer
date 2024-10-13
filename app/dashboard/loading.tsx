import { DashboardHeader } from "@/components/header"
import { ApiCreateButton } from "@/components/api-create-button"
import { ApiItem } from "@/components/api-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="APIs" text="Create and manage APIs.">
        <ApiCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <ApiItem.Skeleton />
        <ApiItem.Skeleton />
        <ApiItem.Skeleton />
        <ApiItem.Skeleton />
        <ApiItem.Skeleton />
      </div>
    </DashboardShell>
  )
}

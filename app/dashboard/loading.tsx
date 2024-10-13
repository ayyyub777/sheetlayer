import { DashboardHeader } from "@/components/header"
import { ApiCreateButton } from "@/components/api-create-button"
import { ApiItem } from "@/components/api-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API's" text="Create and manage API's.">
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

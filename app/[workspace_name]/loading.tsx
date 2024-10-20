import { DashboardHeader } from "@/components/header"
import { ApiCreateButton } from "@/app/[workspace_name]/(apis)/components/api-create-button"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="APIs" text="Create and manage APIs.">
        <ApiCreateButton />
      </DashboardHeader>
    </DashboardShell>
  )
}

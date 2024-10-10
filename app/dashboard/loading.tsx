import { DashboardHeader } from "@/components/header"
import { SpreadsheetCreateButton } from "@/components/spreadsheet-create-button"
import { SpreadsheetItem } from "@/components/spreadsheet-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API's" text="Create and manage API's.">
        <SpreadsheetCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <SpreadsheetItem.Skeleton />
        <SpreadsheetItem.Skeleton />
        <SpreadsheetItem.Skeleton />
        <SpreadsheetItem.Skeleton />
        <SpreadsheetItem.Skeleton />
      </div>
    </DashboardShell>
  )
}

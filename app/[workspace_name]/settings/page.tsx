import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Name } from "./components/workspace/name"

export const metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" />
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Manage your workspace settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Name />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

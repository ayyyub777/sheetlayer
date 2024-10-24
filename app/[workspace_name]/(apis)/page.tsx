import { getApis } from "@/actions/api"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ApiCreateButton } from "@/app/[workspace_name]/(apis)/components/api-create-button"
import ApiList from "@/app/[workspace_name]/(apis)/components/api-list"

export default async function ApisPage({
  params,
}: {
  params: { workspace_name: string }
}) {
  const { workspace_name } = params
  const apis =
    (await getApis(workspace_name).then((res) => res.success?.data)) || []

  return (
    <DashboardShell>
      <DashboardHeader heading="APIs" text="Create and manage APIs.">
        <ApiCreateButton size="sm" />
      </DashboardHeader>
      <ApiList defaultApis={apis} workspaceName={workspace_name} />
    </DashboardShell>
  )
}

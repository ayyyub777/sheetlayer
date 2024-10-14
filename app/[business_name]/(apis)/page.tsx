import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ApiCreateButton } from "@/components/api-create-button"
import { getApis } from "@/actions/api"
import ApiList from "@/components/api-list"

export default async function ApisPage({
  params,
}: {
  params: { business_name: string }
}) {
  const { business_name } = params
  const apis =
    (await getApis(business_name).then((res) => res.success?.data)) || []

  return (
    <DashboardShell>
      <DashboardHeader heading="APIs" text="Create and manage APIs.">
        <ApiCreateButton size="sm" />
      </DashboardHeader>
      <ApiList defaultApis={apis} />
    </DashboardShell>
  )
}

import { notFound, redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { DashboardNav } from "@/app/[workspace_name]/components/nav"
import { UserAccountNav } from "@/app/[workspace_name]/components/user-account-nav"
import { db } from "@/lib/db"
import WorkspaceSwitcher from "./components/workspace-switcher"
import SearchInput from "./components/search-input"
import { Icons } from "@/components/icons"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params?: {
    workspace_name: string
  }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const { setup } = user

  if (!setup) {
    return redirect("/setup")
  }

  const workspaceName = params?.workspace_name
  const workspace = await db.workspace.findFirst({
    where: {
      name: workspaceName,
      userId: user.id,
    },
  })

  if (!workspace) {
    return notFound()
  }

  const workspaces = await db.workspace.findMany({
    where: {
      userId: user.id,
    },
    include: {
      apis: true,
    },
  })

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 gap-6 px-4 md:grid-cols-[220px_1fr] md:gap-12">
        <aside className="flex w-full flex-col py-4 md:w-[220px]">
          <div className="mb-8 flex min-h-10 items-center">
            <Icons.logo className="h-[30px] w-auto" />
          </div>
          <div className="flex h-full flex-col justify-between">
            <DashboardNav
              items={dashboardConfig.sidebarNav}
              workspace={workspace.name}
            />
            <WorkspaceSwitcher items={workspaces} />
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden pt-4">
          <header className="mb-8 flex h-10 items-center justify-between">
            <SearchInput />
            <UserAccountNav
              user={{
                name: user.name,
                picture: user.picture,
                email: user.email,
              }}
            />
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}

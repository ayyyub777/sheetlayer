import { notFound, redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { DashboardNav } from "@/app/[business_name]/components/nav"
import { UserAccountNav } from "@/app/[business_name]/components/user-account-nav"
import { db } from "@/lib/db"
import BusinessSwitcher from "./components/business-switcher"
import SearchInput from "./components/search-input"
import { Icons } from "@/components/icons"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params?: {
    business_name: string
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

  const businessName = params?.business_name
  const business = await db.business.findFirst({
    where: {
      name: businessName,
      userId: user.id,
    },
  })

  if (!business) {
    return notFound()
  }

  const businesses = await db.business.findMany({
    where: {
      userId: user.id,
    },
    include: {
      apis: true,
    },
  })

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 gap-6 pt-8 md:grid-cols-[220px_1fr] md:gap-12">
        <aside className="flex w-full flex-col gap-4 md:w-[220px]">
          <BusinessSwitcher items={businesses} />
          <DashboardNav
            items={dashboardConfig.sidebarNav}
            business={business.name}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <header className="mb-4 flex h-[60px] items-start justify-between">
            <SearchInput placeholder="Search" />
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

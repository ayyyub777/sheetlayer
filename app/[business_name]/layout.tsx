import { notFound, redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { db } from "@/lib/db"
import BusinessSwitcher from "./components/business-switcher"

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
      <header className="sticky top-0 z-40 bg-background">
        <div className="container flex h-20 items-center justify-between py-6">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-6 md:grid-cols-[220px_1fr] md:gap-12">
        <aside className="flex w-full flex-col gap-4 md:w-[220px]">
          <BusinessSwitcher items={businesses} />
          <DashboardNav
            items={dashboardConfig.sidebarNav}
            business={business.name}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
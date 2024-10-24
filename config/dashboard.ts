import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Projects",
      href: "/",
      icon: "table",
    },
    {
      title: "Billing",
      href: "/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
  userNav: [
    {
      title: "Dashboard",
      href: "/",
    },
  ],
}

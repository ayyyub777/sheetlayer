"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface DashboardNavProps {
  items: SidebarNavItem[]
  business: string
}

export function DashboardNav({ items, business }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <ScrollArea className="w-full">
      <nav className="flex gap-1 md:flex-col">
        {items.map((item) => {
          const Icon = Icons[item.icon || "arrowRight"]
          return (
            item.href && (
              <Link
                key={item.href}
                href={item.disabled ? "/" : `/${business}/${item.href}`}
              >
                <span
                  className={cn(
                    "group flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === `/${business}${item.href}`.replace(/\/$/, "")
                      ? "bg-accent hover:bg-accent"
                      : "transparent hover:bg-accent/50",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 size-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          )
        })}
      </nav>
      <ScrollBar orientation="horizontal" className="md:hidden" />
    </ScrollArea>
  )
}

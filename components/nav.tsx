"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <ScrollArea className="w-full">
      <nav className="flex gap-2 md:flex-col">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"]
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                className="min-w-32"
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    path !== item.href &&
                      "hover:bg-accent/40 hover:text-accent-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-3 size-[18px]" />
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

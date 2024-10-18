"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/app/[business_name]/components/user-avatar"
import { dashboardConfig } from "@/config/dashboard"

type User = {
  name: string | null | undefined
  picture: string | null | undefined
  email: string | null | undefined
}

export function UserAccountNav({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            picture: user.picture || null,
            email: user.email || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col">
            {user.name && <p className="text-sm font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {dashboardConfig.userNav.map((item) => (
          <Link key={item.href} href={item.disabled ? "" : `${item.href}`}>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={item.disabled}
            >
              {item.title}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

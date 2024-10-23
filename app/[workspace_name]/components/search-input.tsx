"use client"

import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export default function SearchInput() {
  return (
    <div className="relative h-9 w-72">
      <Icons.search className="absolute left-0 top-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="border-none pl-[26px] focus:border"
      />
    </div>
  )
}

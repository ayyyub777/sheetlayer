"use client"

import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"

export default function SearchInput() {
  return (
    <div className="relative h-9 w-72">
      <Icons.search className="absolute left-0 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="border-none pl-[26px] focus:border"
      />
    </div>
  )
}

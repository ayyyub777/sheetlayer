"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"

export default function SearchInput({
  placeholder = "Search...",
}: {
  placeholder: string
}) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (isMac && event.metaKey && event.key === "k") ||
        (!isMac && event.ctrlKey && event.key === "k")
      ) {
        event.preventDefault()
        document.getElementById("search-input")?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMac])

  return (
    <div className="relative h-9 w-72">
      <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder={placeholder} className="pl-8" />
      <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[8px] font-medium opacity-100 sm:flex">
        <span className="text-xs text-muted-foreground">
          {isMac ? "⌘" : "Ctrl"}K
        </span>
      </kbd>
    </div>
  )
}

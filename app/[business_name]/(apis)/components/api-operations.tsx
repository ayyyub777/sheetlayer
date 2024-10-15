"use client"

import { Api } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useDeleteApiModal } from "@/hooks/modals/use-delete-api-modal"

export function ApiOperations({ api }: { api: Pick<Api, "id"> }) {
  const deleteApiModal = useDeleteApiModal()
  const handleDelete = () => {
    const params = new URLSearchParams(window.location.search)
    params.set("id", api.id)
    window.history.pushState(null, "", `${window.location.pathname}?${params}`)
    deleteApiModal.onOpen()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
          onSelect={handleDelete}
        >
          Detach API
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

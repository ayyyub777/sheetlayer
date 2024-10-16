"use client"

import { useEffect, useState } from "react"
import { Api } from "@prisma/client"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { getApis } from "@/actions/api"
import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"
import { useDeleteApiModal } from "@/hooks/modals/use-delete-api-modal"
import { env } from "@/env.mjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ApiOperations } from "./api-operations"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

export default function ApiList({
  defaultApis,
  businessName,
}: {
  defaultApis: Api[]
  businessName: string
}) {
  const addApiModal = useAddApiModal()
  const deleteApiModal = useDeleteApiModal()
  const [apis, setApis] = useState<Api[]>(defaultApis)

  useEffect(() => {
    if (!addApiModal.isOpen && !deleteApiModal.isOpen) {
      getApis(businessName).then((res) => {
        if (res?.success?.data) {
          setApis(res.success.data)
        }
      })
    }
  }, [addApiModal.isOpen, deleteApiModal.isOpen])

  return (
    <div>
      {apis?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {apis.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-4">
              <div className="flex h-9 flex-col justify-center gap-1">
                <p className="font-medium leading-none first-letter:uppercase">
                  {api.title}
                </p>
                <div
                  className="flex items-end"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${env.NEXT_PUBLIC_APP_URL}/api/${businessName}/${api.title}`
                    )
                  }
                >
                  <p className="mr-2 cursor-text text-sm leading-none text-muted-foreground">
                    {`${env.NEXT_PUBLIC_APP_URL}/api/${businessName}/${api.title}`}
                  </p>
                  <Popover>
                    <PopoverTrigger className="text-muted-foreground">
                      <Icons.copy className="size-3" />
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-fit px-2 py-1 text-xs"
                      sideOffset={6}
                    >
                      Copied!
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`https://docs.google.com/spreadsheets/d/${api.spreadsheet}`}
                  target="_blank"
                >
                  <Button variant="outline" size="sm">
                    Open in spreadsheet
                  </Button>
                </Link>
                <ApiOperations api={{ id: api.id }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Title>No APIs created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any APIs yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}

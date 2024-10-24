"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getApis } from "@/actions/api"
import { Api } from "@prisma/client"

import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"
import { useDeleteApiModal } from "@/hooks/modals/use-delete-api-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"

import { ApiOperations } from "./api-operations"

export default function ApiList({
  defaultApis,
  workspaceName,
}: {
  defaultApis: Api[]
  workspaceName: string
}) {
  const addApiModal = useAddApiModal()
  const deleteApiModal = useDeleteApiModal()
  const [apis, setApis] = useState<Api[]>(defaultApis)

  useEffect(() => {
    if (!addApiModal.isOpen && !deleteApiModal.isOpen) {
      getApis(workspaceName).then((res) => {
        if (res?.success?.data) {
          setApis(res.success.data)
        }
      })
    }
  }, [addApiModal.isOpen, deleteApiModal.isOpen, workspaceName])

  return (
    <div>
      {apis?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {apis.map((api, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex flex-col space-y-1.5 p-5">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold leading-none first-letter:uppercase">
                    {api.title}
                  </h1>
                  <Badge variant="secondary">Public</Badge>
                </div>
                <div
                  className="flex items-center"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/api/${workspaceName}/${api.title}`
                    )
                  }
                >
                  <p className="mr-2 cursor-text text-sm text-muted-foreground">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/api/${workspaceName}/${api.title}`}
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
              <div className="flex gap-2 mr-5">
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

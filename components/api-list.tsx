"use client"

import { useEffect, useState } from "react"
import { Api } from "@prisma/client"
import { ApiItem } from "./api-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { getApis } from "@/actions/api"
import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"
import { useDeleteApiModal } from "@/hooks/modals/use-delete-api-modal"

export default function ApiList({ defaultApis }: { defaultApis: Api[] }) {
  const addApiModal = useAddApiModal()
  const deleteApiModal = useDeleteApiModal()
  const [apis, setApis] = useState<Api[]>(defaultApis)

  useEffect(() => {
    if (!addApiModal.isOpen && !deleteApiModal.isOpen) {
      getApis().then((res) => {
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
            <ApiItem key={index} api={api} />
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

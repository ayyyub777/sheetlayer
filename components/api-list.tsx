"use client"

import { Api } from "@prisma/client"
import { ApiItem } from "./api-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"
import { useEffect, useState } from "react"
import { getApis } from "@/actions/api"

export default function ApiList({ defaultApis }: { defaultApis: Api[] }) {
  const addApiModal = useAddApiModal()
  const [apis, setApis] = useState<Api[]>(defaultApis)

  useEffect(() => {
    if (!addApiModal.isOpen) {
      getApis().then((res) => {
        if (res?.success?.data) {
          setApis(res.success.data)
        }
      })
    }
  }, [addApiModal.isOpen])

  return (
    <div>
      {apis?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {apis.map((api) => (
            <ApiItem key={api.id} api={api} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No APIs created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any APIs yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useDeleteApiModal } from "@/hooks/modals/use-delete-api-modal"
import { Modal } from "../ui/modal"
import { toast } from "../ui/use-toast"

export default function DeleteApi() {
  const { isOpen, onClose } = useDeleteApiModal()
  const [isPending, setIsPending] = useState(false)
  const [id, setId] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fetchedId = params.get("id") || ""
    setId(fetchedId)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      history.pushState(null, "", window.location.pathname)
    }
  }, [isOpen])

  const onSubmit = async () => {
    setIsPending(true)
    const response = await fetch(`/api/apis/${id}`, {
      method: "DELETE",
    })
    setIsPending(false)

    if (!response?.ok) {
      toast({
        description: "Your api was not deleted. Please try again.",
      })
    } else {
      toast({
        description: "Your api was successfully deleted.",
      })
    }

    onClose()
  }

  return (
    <Modal
      title="Detach API"
      description="Detaching this API will remove it from your account, but it will remain in your spreadsheet and can be reattached anytime."
      isOpen={isOpen}
      onClose={onClose}
      action={{
        label: "Delete",
        disabled: isPending,
        onClick: onSubmit,
        isPending,
      }}
    >
      <></>
    </Modal>
  )
}

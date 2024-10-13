"use client"

import { useMounted } from "@/hooks/use-mounted"

import AddApi from "./modals/add-api"
import DeleteApi from "./modals/delete-api"

export const ModalProvider = () => {
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return (
    <>
      <AddApi />
      <DeleteApi />
    </>
  )
}

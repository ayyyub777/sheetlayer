"use client"

import { useMounted } from "@/hooks/use-mounted"

import AddApi from "./modals/add-api"

export const ModalProvider = () => {
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return (
    <>
      <AddApi />
    </>
  )
}
